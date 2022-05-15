import { PlayerActionA, PlayerActionB } from './lib/PlayerActions';
import { RoutineFalse, RoutineTrue } from './lib/Routines';
import Strategy from '../Strategy';
import { expect, spy } from 'chai';
import High from '@civ-clone/core-rule/Priorities/High';
import Strategies from '../Strategies';

describe('Strategy', () => {
  it('should default to `Normal` `Priority`', () =>
    expect(new Strategy().priority().value()).eq(2000));

  it('should be possible to limit the `PlayerAction`s that can be handled, via the `Routine`s', () => {
    const strategy = new Strategy(new RoutineTrue(PlayerActionA));

    expect(strategy.canHandle(new PlayerActionB(null))).false;
    expect(strategy.canHandle(new PlayerActionA(null))).true;
  });

  it('should stop calling `Routine`s after the first successful `attempt()`', async () => {
    const routineA = new RoutineFalse(PlayerActionA),
      routineB = new RoutineTrue(PlayerActionA),
      routineC = new RoutineTrue(PlayerActionA),
      strategy = new Strategy(routineA, routineB, routineC),
      spyA = spy.on(routineA, 'attempt'),
      spyB = spy.on(routineB, 'attempt'),
      spyC = spy.on(routineC, 'attempt');

    expect(await strategy.attempt(new PlayerActionA(null))).true;
    expect(spyA).not.called;
    expect(spyB).called;
    expect(spyC).not.called;
  });

  it('should respect `Routine` `Priority`s', async () => {
    const routineA = new RoutineTrue(PlayerActionA),
      routineB = new RoutineTrue(PlayerActionA, new High()),
      strategy = new Strategy(routineA, routineB),
      spyA = spy.on(routineA, 'attempt'),
      spyB = spy.on(routineB, 'attempt');

    expect(await strategy.attempt(new PlayerActionA(null))).true;
    expect(spyA).not.called;
    expect(spyB).called;
  });

  it('should return false if there are no successfully executed `Routine`s', async () => {
    const routineA = new RoutineFalse(PlayerActionA),
      routineB = new RoutineFalse(PlayerActionA),
      routineC = new RoutineFalse(PlayerActionA),
      strategy = new Strategy(routineA, routineB, routineC),
      spyA = spy.on(routineA, 'attempt'),
      spyB = spy.on(routineB, 'attempt'),
      spyC = spy.on(routineC, 'attempt');

    expect(await strategy.attempt(new PlayerActionA(null))).false;
    expect(spyA).called;
    expect(spyB).called;
    expect(spyC).called;
  });
});
