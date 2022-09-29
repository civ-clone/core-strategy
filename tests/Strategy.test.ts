import { High, Normal } from '@civ-clone/core-rule/Priorities';
import { PlayerActionA, PlayerActionB } from './lib/PlayerActions';
import { RoutineFalse, RoutineB, RoutineA, RoutineTrue } from './lib/Routines';
import { expect, spy } from 'chai';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import Priority from '@civ-clone/core-rule/Priority';
import PriorityRule from '../Rules/Priority';
import Routine from '../Routine';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Strategy from '../Strategy';

describe('Strategy', () => {
  const testPlayer = new Player();

  it('should default to `Priority(Infinity)`', () =>
    expect(new Strategy().priority(testPlayer).value()).eq(Infinity));

  it('should be possible to limit the `PlayerAction`s that can be handled, via the `Routine`s', () => {
    const strategy = new Strategy(new RoutineTrue(PlayerActionA));

    expect(strategy.canHandle(new PlayerActionA(testPlayer, null))).true;
    expect(strategy.canHandle(new PlayerActionB(testPlayer, null))).false;
  });

  it('should stop calling `Routine`s after the first successful `attempt()`', async () => {
    const routineA = new RoutineFalse(PlayerActionA),
      routineB = new RoutineTrue(PlayerActionA),
      routineC = new RoutineTrue(PlayerActionA),
      strategy = new Strategy(routineA, routineB, routineC),
      spyA = spy.on(routineA, 'attempt'),
      spyB = spy.on(routineB, 'attempt'),
      spyC = spy.on(routineC, 'attempt');

    expect(await strategy.attempt(new PlayerActionA(testPlayer, null))).true;
    expect(spyA).called();
    expect(spyB).called();
    expect(spyC).not.called();
  });

  it('should respect `Routine` `Priority`s', async () => {
    const ruleRegistry = new RuleRegistry(),
      routineA = new RoutineA(PlayerActionA, ruleRegistry),
      routineB = new RoutineB(PlayerActionA, ruleRegistry),
      strategy = new Strategy(routineA, routineB),
      spyA = spy.on(routineA, 'attempt'),
      spyB = spy.on(routineB, 'attempt');

    ruleRegistry.register(
      ...(
        [
          [RoutineA, High],
          [RoutineB, Normal],
        ] as [typeof Routine, typeof Priority][]
      ).map(
        ([RoutineType, PriorityType]) =>
          new PriorityRule(
            new Criterion(
              (player: Player, routine: Routine) =>
                routine instanceof RoutineType
            ),
            new Effect(() => new PriorityType())
          )
      )
    );

    expect(await strategy.attempt(new PlayerActionA(testPlayer, null))).true;
    expect(spyA).called();
    expect(spyB).not.called();
  });

  it('should return false if there are no successfully executed `Routine`s', async () => {
    const routineA = new RoutineFalse(PlayerActionA),
      routineB = new RoutineFalse(PlayerActionA),
      routineC = new RoutineFalse(PlayerActionA),
      strategy = new Strategy(routineA, routineB, routineC),
      spyA = spy.on(routineA, 'attempt'),
      spyB = spy.on(routineB, 'attempt'),
      spyC = spy.on(routineC, 'attempt');

    expect(await strategy.attempt(new PlayerActionA(testPlayer, null))).false;
    expect(spyA).called();
    expect(spyB).called();
    expect(spyC).called();
  });
});
