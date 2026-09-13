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

describe('StrategyRegistry', () => {
  const testPlayer = new Player();

  it('should stop calling `Strategy`s after the first successful `attempt()`', async () => {
    // `A` is given the higher priority so that it definitely runs first.
    // Equal priorities are ordered by a random draw, which would make "the
    // second one was not reached" true only some of the time.
    const ruleRegistry = new RuleRegistry(),
      strategyA = new StrategyTrue(ruleRegistry),
      strategyB = new StrategyTrue(ruleRegistry),
      strategyRegistry = new StrategyRegistry();

    ruleRegistry.register(
      new PriorityRule(
        new Criterion(
          (action: PlayerAction, strategy: Strategy): boolean =>
            strategy === strategyA
        ),
        new Effect((): PriorityValue => new PriorityValue(1))
      )
    );

    const spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt');

    strategyRegistry.register(strategyA, strategyB);

    expect(strategyRegistry.attempt(new PlayerAction(testPlayer, null))).true;
    expect(spyA).to.have.been.called();
    expect(spyB).to.not.have.been.called();
  });

  it('should respect `Strategy` `Priority`s', async () => {
    const ruleRegistry = new RuleRegistry(),
      strategyA = new StrategyTrue(ruleRegistry),
      strategyB = new StrategyTrue(ruleRegistry),
      strategyRegistry = new StrategyRegistry();

    // Without this the two are tied and the order is a coin flip. Giving `B`
    // the lower value — which is the higher priority — is the whole point of
    // the test, and it is what makes the assertion below meaningful rather
    // than true three times in four.
    ruleRegistry.register(
      new PriorityRule(
        new Criterion(
          (action: PlayerAction, strategy: Strategy): boolean =>
            strategy === strategyB
        ),
        new Effect((): PriorityValue => new PriorityValue(1))
      )
    );

    const spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt');

    strategyRegistry.register(strategyA, strategyB);

    expect(strategyRegistry.attempt(new PlayerAction(testPlayer, null))).true;
    expect(spyB).to.have.been.called();
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

    expect(strategyRegistry.attempt(new PlayerAction(testPlayer, null))).false;
    expect(spyA).to.have.been.called();
    expect(spyB).to.have.been.called();
    expect(spyC).to.have.been.called();
  });
});
