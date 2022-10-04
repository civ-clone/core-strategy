import { High, Normal } from '@civ-clone/core-rule/Priorities';
import { RoutineA, RoutineB, RoutineFalse, RoutineTrue } from './lib/Routines';
import { expect, spy } from 'chai';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import { PlayerAction } from './lib/PlayerActions';
import Priority from '@civ-clone/core-rule/Priority';
import PriorityRule from '../Rules/Priority';
import Routine from '../Routine';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Strategy from '../Strategy';

describe('Strategy', () => {
  const testPlayer = new Player();

  it('should default to `Priority(Infinity)`', () =>
    expect(new Strategy().priority(testPlayer).value()).eq(Infinity));

  it('should stop calling `Routine`s after the first successful `attempt()`', async () => {
    const routineA = new RoutineFalse(),
      routineB = new RoutineTrue(),
      routineC = new RoutineTrue(),
      strategy = new Strategy(routineA, routineB, routineC),
      spyA = spy.on(routineA, 'attempt'),
      spyB = spy.on(routineB, 'attempt'),
      spyC = spy.on(routineC, 'attempt');

    expect(await strategy.attempt(new PlayerAction(testPlayer, null))).true;
    expect(spyA).called();
    expect(spyB).called();
    expect(spyC).not.called();
  });

  it('should respect `Routine` `Priority`s', async () => {
    const ruleRegistry = new RuleRegistry(),
      routineA = new RoutineA(ruleRegistry),
      routineB = new RoutineB(ruleRegistry),
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

    expect(await strategy.attempt(new PlayerAction(testPlayer, null))).true;
    expect(spyA).called();
    expect(spyB).not.called();
  });

  it('should return false if there are no successfully executed `Routine`s', async () => {
    const routineA = new RoutineFalse(),
      routineB = new RoutineFalse(),
      routineC = new RoutineFalse(),
      strategy = new Strategy(routineA, routineB, routineC),
      spyA = spy.on(routineA, 'attempt'),
      spyB = spy.on(routineB, 'attempt'),
      spyC = spy.on(routineC, 'attempt');

    expect(await strategy.attempt(new PlayerAction(testPlayer, null))).false;
    expect(spyA).called();
    expect(spyB).called();
    expect(spyC).called();
  });
});
