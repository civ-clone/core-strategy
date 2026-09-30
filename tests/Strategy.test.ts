import { High, Low, Normal } from '@civ-clone/core-rule/Priorities';
import { StrategyA, StrategyB } from './lib/Strategies';
import { expect } from 'chai';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Priority from '@civ-clone/core-rule/Priority';
import PriorityRule from '../Rules/Priority';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Strategy from '../Strategy';
import PlayerActionBase from '@civ-clone/core-player/PlayerAction';
import TraitRegistry from '@civ-clone/core-civilization/TraitRegistry';
import Civilization from '@civ-clone/core-civilization/Civilization';
import { TraitFull, TraitHalf, TraitNone } from './lib/Traits';
import Leader from '@civ-clone/core-civilization/Leader';
import Trait from '@civ-clone/core-civilization/Trait';

describe('Strategy', () => {
  const action = new PlayerActionBase(new Player(), null);

  it('should default to `Priority(Infinity)`', () =>
    expect(new Strategy().priority(action).value()).eq(Infinity));

  it('should handle every `PlayerAction` by default', () =>
    expect(new Strategy().handles(action)).true);

  it('should require `attempt` to be implemented', () =>
    expect(() => new Strategy().attempt(action)).throw());

  it('should be possible to prioritise based on `Priority` `Rule`s', async () => {
    const traitRegistry = new TraitRegistry(),
      ruleRegistry = new RuleRegistry(),
      civilization = new Civilization(),
      traitNone = new TraitNone(Leader),
      traitHalf = new TraitHalf(Leader),
      traitFull = new TraitFull(Leader),
      testPlayer = action.player(),
      strategyA = new StrategyA(ruleRegistry),
      strategyB = new StrategyB(ruleRegistry);

    ruleRegistry.register(
      ...(
        [
          [StrategyA, TraitFull, High],
          [StrategyA, TraitHalf, Normal],
          [StrategyA, TraitNone, Low],
          [StrategyB, TraitFull, Low],
          [StrategyB, TraitHalf, Normal],
          [StrategyB, TraitNone, High],
        ] as [typeof Strategy, typeof Trait, typeof Priority][]
      ).map(
        ([RoutineType, TraitType, PriorityType]) =>
          new PriorityRule(
            new Criterion(
              (action: PlayerActionBase, strategy: Strategy) =>
                strategy instanceof RoutineType
            ),
            new Criterion(
              (action: PlayerActionBase) =>
                action.player().civilization().leader() !== null
            ),
            new Criterion((action: PlayerActionBase) =>
              traitRegistry
                .getByLeader(
                  action
                    .player()
                    .civilization()
                    .leader()!
                    .sourceClass() as typeof Leader
                )
                .some((trait) => trait instanceof TraitType)
            ),
            new Effect(() => new PriorityType())
          )
      )
    );

    testPlayer.setCivilization(civilization);
    civilization.setLeader(new Leader());
    traitRegistry.register(traitFull);

    expect(strategyA.priority(action).value()).equal(new High().value());
    expect(strategyB.priority(action).value()).equal(new Low().value());

    traitRegistry.unregister(traitFull);
    traitRegistry.register(traitHalf);

    expect(strategyA.priority(action).value()).equal(new Normal().value());
    expect(strategyB.priority(action).value()).equal(new Normal().value());

    traitRegistry.unregister(traitHalf);
    traitRegistry.register(traitNone);

    expect(strategyA.priority(action).value()).equal(new Low().value());
    expect(strategyB.priority(action).value()).equal(new High().value());
  });
});
