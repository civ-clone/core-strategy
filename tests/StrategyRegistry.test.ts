import { StrategyFalse, StrategyTrue } from './lib/Strategies';
import { expect, spy, use } from 'chai';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import { PlayerAction } from './lib/PlayerActions';
import PriorityRule from '../Rules/Priority';
import PriorityValue from '@civ-clone/core-rule/Priority';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Strategy from '../Strategy';
import StrategyRegistry from '../StrategyRegistry';
import * as spies from 'chai-spies';

use(spies);

// Records when it starts and finishes, and yields to the event loop in between, so that overlapping attempts would
// interleave in the log.
class LoggingStrategy extends Strategy {
  private _log: string[];
  private _name: string;
  private _result: boolean;

  constructor(
    name: string,
    result: boolean,
    log: string[],
    ruleRegistry: RuleRegistry = new RuleRegistry()
  ) {
    super(ruleRegistry);

    this._log = log;
    this._name = name;
    this._result = result;
  }

  async attempt(): Promise<boolean> {
    this._log.push(`${this._name} start`);

    await new Promise((resolve) => setTimeout(resolve, 1));

    this._log.push(`${this._name} end`);

    return this._result;
  }
}

class StrategyNotHandling extends StrategyTrue {
  handles(): boolean {
    return false;
  }
}

const priorityFor = (
  ruleRegistry: RuleRegistry,
  strategy: Strategy,
  value: number
): void =>
  ruleRegistry.register(
    new PriorityRule(
      new Criterion(
        (action: PlayerAction, candidate: Strategy): boolean =>
          candidate === strategy
      ),
      new Effect((): PriorityValue => new PriorityValue(value))
    )
  );

describe('StrategyRegistry', () => {
  const testPlayer = new Player(),
    action = new PlayerAction(testPlayer, null);

  describe('attempt', () => {
    it('should stop calling `Strategy`s after the first successful `attempt()`', async () => {
      const strategyA = new StrategyTrue(new RuleRegistry()),
        strategyB = new StrategyTrue(new RuleRegistry()),
        strategyRegistry = new StrategyRegistry(),
        spyA = spy.on(strategyA, 'attempt'),
        spyB = spy.on(strategyB, 'attempt');

      strategyRegistry.register(strategyA, strategyB);

      expect(await strategyRegistry.attempt(action)).true;
      expect(spyA).to.have.been.called.once;
      expect(spyB).to.not.have.been.called();
    });

    it('should respect `Strategy` `Priority`s', async () => {
      const ruleRegistry = new RuleRegistry(),
        strategyA = new StrategyTrue(ruleRegistry),
        strategyB = new StrategyTrue(ruleRegistry),
        strategyRegistry = new StrategyRegistry(),
        spyA = spy.on(strategyA, 'attempt'),
        spyB = spy.on(strategyB, 'attempt');

      // `B` is registered second, so only its lower value (higher priority) can put it first.
      priorityFor(ruleRegistry, strategyB, 1);

      strategyRegistry.register(strategyA, strategyB);

      expect(await strategyRegistry.attempt(action)).true;
      expect(spyB).to.have.been.called.once;
      expect(spyA).to.not.have.been.called();
    });

    it('should return false if there are no successfully executed `Strategy`s', async () => {
      const strategyA = new StrategyFalse(),
        strategyB = new StrategyFalse(),
        strategyC = new StrategyFalse(),
        strategyRegistry = new StrategyRegistry(),
        spyA = spy.on(strategyA, 'attempt'),
        spyB = spy.on(strategyB, 'attempt'),
        spyC = spy.on(strategyC, 'attempt');

      strategyRegistry.register(strategyA, strategyB, strategyC);

      expect(await strategyRegistry.attempt(action)).false;
      expect(spyA).to.have.been.called.once;
      expect(spyB).to.have.been.called.once;
      expect(spyC).to.have.been.called.once;
    });

    it('should return false when nothing is registered', async () =>
      expect(await new StrategyRegistry().attempt(action)).false);

    it('should break ties by registration order, including when no `Priority` applies (`Infinity`)', async () => {
      const ruleRegistry = new RuleRegistry(),
        log: string[] = [],
        strategies = ['A', 'B', 'C', 'D', 'E'].map(
          (name) => new LoggingStrategy(name, false, log, ruleRegistry)
        ),
        strategyRegistry = new StrategyRegistry();

      // `B` and `D` tie at 5, the rest tie at `Infinity`.
      priorityFor(ruleRegistry, strategies[1], 5);
      priorityFor(ruleRegistry, strategies[3], 5);

      strategyRegistry.register(...strategies);

      expect(await strategyRegistry.attempt(action)).false;
      expect(log.filter((entry) => entry.endsWith('start'))).eql([
        'B start',
        'D start',
        'A start',
        'C start',
        'E start',
      ]);
    });

    it('should never draw from the random number generator', async () => {
      const randomNumberGenerator = spy((): number => 0.5),
        strategyRegistry = new StrategyRegistry(randomNumberGenerator),
        strategies = Array.from(
          { length: 10 },
          () => new StrategyFalse(new RuleRegistry())
        );

      strategyRegistry.register(...strategies);

      await strategyRegistry.attempt(action);
      await strategyRegistry.attemptAll(action);

      expect(randomNumberGenerator).to.not.have.been.called();
    });

    it("should compute each `Strategy`'s `Priority` exactly once", async () => {
      const strategies = Array.from(
          { length: 10 },
          () => new StrategyFalse(new RuleRegistry())
        ),
        prioritySpies = strategies.map((strategy) =>
          spy.on(strategy, 'priority')
        ),
        strategyRegistry = new StrategyRegistry();

      strategyRegistry.register(...strategies);

      await strategyRegistry.attempt(action);

      prioritySpies.forEach(
        (prioritySpy) => expect(prioritySpy).to.have.been.called.once
      );
    });

    it('should await each `attempt` before starting the next, and stop at the first `true`', async () => {
      const log: string[] = [],
        strategyRegistry = new StrategyRegistry();

      strategyRegistry.register(
        new LoggingStrategy('A', false, log),
        new LoggingStrategy('B', true, log),
        new LoggingStrategy('C', true, log)
      );

      expect(await strategyRegistry.attempt(action)).true;
      expect(log).eql(['A start', 'A end', 'B start', 'B end']);
    });

    it('should skip a `Strategy` that does not handle the `action` before evaluating its `Priority`', async () => {
      const notHandling = new StrategyNotHandling(new RuleRegistry()),
        handling = new StrategyTrue(new RuleRegistry()),
        handlesSpy = spy.on(notHandling, 'handles'),
        prioritySpy = spy.on(notHandling, 'priority'),
        attemptSpy = spy.on(notHandling, 'attempt'),
        handlingSpy = spy.on(handling, 'attempt'),
        strategyRegistry = new StrategyRegistry();

      strategyRegistry.register(notHandling, handling);

      expect(await strategyRegistry.attempt(action)).true;
      expect(handlesSpy).to.have.been.called.once;
      expect(prioritySpy).to.not.have.been.called();
      expect(attemptSpy).to.not.have.been.called();
      expect(handlingSpy).to.have.been.called.once;
    });

    it('should return false if no `Strategy` handles the `action`', async () => {
      const strategyRegistry = new StrategyRegistry();

      strategyRegistry.register(new StrategyNotHandling(new RuleRegistry()));

      expect(await strategyRegistry.attempt(action)).false;
    });
  });

  describe('attemptAll', () => {
    it('should run every handling `Strategy` in order, one at a time, whatever they return', async () => {
      const ruleRegistry = new RuleRegistry(),
        log: string[] = [],
        strategyA = new LoggingStrategy('A', true, log, ruleRegistry),
        strategyB = new LoggingStrategy('B', false, log, ruleRegistry),
        strategyC = new LoggingStrategy('C', true, log, ruleRegistry),
        notHandling = new StrategyNotHandling(ruleRegistry),
        notHandlingSpy = spy.on(notHandling, 'attempt'),
        strategyRegistry = new StrategyRegistry();

      priorityFor(ruleRegistry, strategyC, 1);

      strategyRegistry.register(strategyA, notHandling, strategyB, strategyC);

      expect(await strategyRegistry.attemptAll(action)).true;
      expect(log).eql([
        'C start',
        'C end',
        'A start',
        'A end',
        'B start',
        'B end',
      ]);
      expect(notHandlingSpy).to.not.have.been.called();
    });

    it('should return false if no `Strategy` returned true', async () => {
      const strategyA = new StrategyFalse(new RuleRegistry()),
        strategyB = new StrategyFalse(new RuleRegistry()),
        spyA = spy.on(strategyA, 'attempt'),
        spyB = spy.on(strategyB, 'attempt'),
        strategyRegistry = new StrategyRegistry();

      strategyRegistry.register(strategyA, strategyB);

      expect(await strategyRegistry.attemptAll(action)).false;
      expect(spyA).to.have.been.called.once;
      expect(spyB).to.have.been.called.once;
    });
  });

  describe('ordered', () => {
    it('should list the handling `Strategy`s in the order `attempt` tries them, without attempting any', async () => {
      const ruleRegistry = new RuleRegistry(),
        log: string[] = [],
        strategyA = new LoggingStrategy('A', false, log, ruleRegistry),
        strategyB = new LoggingStrategy('B', false, log, ruleRegistry),
        strategyC = new LoggingStrategy('C', false, log, ruleRegistry),
        notHandling = new StrategyNotHandling(ruleRegistry),
        strategyRegistry = new StrategyRegistry();

      priorityFor(ruleRegistry, strategyC, 1);

      strategyRegistry.register(strategyA, notHandling, strategyB, strategyC);

      const ordered = strategyRegistry.ordered(action);

      expect(ordered.length).equal(3);
      expect(ordered[0]).equal(strategyC);
      expect(ordered[1]).equal(strategyA);
      expect(ordered[2]).equal(strategyB);
      expect(log).eql([]);

      await strategyRegistry.attempt(action);

      expect(log.filter((entry) => entry.endsWith('start'))).eql([
        'C start',
        'A start',
        'B start',
      ]);
    });
  });
});
