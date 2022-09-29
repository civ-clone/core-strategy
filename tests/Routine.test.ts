import { High, Low, Normal } from '@civ-clone/core-rule/Priorities';
import { PlayerActionA, PlayerActionB } from './lib/PlayerActions';
import { RoutineB, RoutineA } from './lib/Routines';
import { TraitFull, TraitHalf, TraitNone } from './lib/Traits';
import Civilization from '@civ-clone/core-civilization/Civilization';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Leader from '@civ-clone/core-civilization/Leader';
import Player from '@civ-clone/core-player/Player';
import Priority from '@civ-clone/core-rule/Priority';
import PriorityRule from '../Rules/Priority';
import Routine from '../Routine';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Trait from '@civ-clone/core-civilization/Trait';
import TraitRegistry from '@civ-clone/core-civilization/TraitRegistry';
import { expect } from 'chai';

describe('Routine', () => {
  const testPlayer = new Player();

  it('should default to `Normal` `Priority`', () => {
    const routine = new Routine();

    expect(routine.priority(testPlayer).value()).equal(Infinity);
  });

  it('should be possible to limit the `PlayerAction`s that can be handled', async () => {
    const routine = new Routine(PlayerActionA);

    expect(routine.canHandle(new PlayerActionB(testPlayer, null))).false;
    expect(routine.canHandle(new PlayerActionA(testPlayer, null))).true;
  });

  it('should be possible to prioritise based on `Priority` `Rule`s', async () => {
    const traitRegistry = new TraitRegistry(),
      ruleRegistry = new RuleRegistry(),
      civilization = new Civilization(),
      traitNone = new TraitNone(Leader),
      traitHalf = new TraitHalf(Leader),
      traitFull = new TraitFull(Leader),
      routine = new RoutineA(ruleRegistry),
      inverseRoutine = new RoutineB(ruleRegistry);

    ruleRegistry.register(
      ...(
        [
          [RoutineA, TraitFull, High],
          [RoutineA, TraitHalf, Normal],
          [RoutineA, TraitNone, Low],
          [RoutineB, TraitFull, Low],
          [RoutineB, TraitHalf, Normal],
          [RoutineB, TraitNone, High],
        ] as [typeof Routine, typeof Trait, typeof Priority][]
      ).map(
        ([RoutineType, TraitType, PriorityType]) =>
          new PriorityRule(
            new Criterion(
              (player: Player, routine: Routine) =>
                routine instanceof RoutineType
            ),
            new Criterion(
              (player: Player) => player.civilization().leader() !== null
            ),
            new Criterion((player: Player) =>
              traitRegistry
                .getByLeader(
                  player.civilization().leader()!.sourceClass() as typeof Leader
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

    expect(routine.priority(testPlayer).value()).equal(new High().value());
    expect(inverseRoutine.priority(testPlayer).value()).equal(
      new Low().value()
    );

    traitRegistry.unregister(traitFull);
    traitRegistry.register(traitHalf);

    expect(routine.priority(testPlayer).value()).equal(new Normal().value());
    expect(inverseRoutine.priority(testPlayer).value()).equal(
      new Normal().value()
    );

    traitRegistry.unregister(traitHalf);
    traitRegistry.register(traitNone);

    expect(routine.priority(testPlayer).value()).equal(new Low().value());
    expect(inverseRoutine.priority(testPlayer).value()).equal(
      new High().value()
    );
  });
});
