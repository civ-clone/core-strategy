import { RoutineTrue, RoutineFalse } from './lib/Routines';
import High from '@civ-clone/core-rule/Priorities/High';
import Player from '@civ-clone/core-player/Player';
import { PlayerActionA } from './lib/PlayerActions';
import Strategies from '../Strategies';
import Strategy from '../Strategy';
import { expect, spy, use } from 'chai';
import * as spies from 'chai-spies';

use(spies);

describe('Strategies', () => {
  const testPlayer = new Player();

  it('should filter inactive `Strategy`s', async () => {
    const strategyA = new Strategy(new RoutineTrue(PlayerActionA), testPlayer),
      strategyB = new Strategy(new RoutineTrue(PlayerActionA), testPlayer),
      strategies = new Strategies(strategyA, strategyB),
      spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt');

    strategyB.setActive(true);

    expect(await strategies.attempt(new PlayerActionA(null))).true;
    expect(spyA).not.called;
    expect(spyB).called;
  });

  it('should stop calling `Strategy`s after the first successful `attempt()`', async () => {
    const strategyA = new Strategy(new RoutineTrue(PlayerActionA), testPlayer),
      strategyB = new Strategy(new RoutineFalse(PlayerActionA), testPlayer),
      strategies = new Strategies(strategyA, strategyB),
      spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt');

    strategyA.setActive(true);
    strategyB.setActive(true);

    expect(await strategies.attempt(new PlayerActionA(null))).true;
    expect(spyA).called;
    expect(spyB).not.called;
  });

  it('should respect `Strategy` `Priority`s', async () => {
    const routine = new RoutineTrue(PlayerActionA),
      strategyA = new Strategy(routine, testPlayer),
      strategyB = new Strategy(routine, new High(), testPlayer),
      strategies = new Strategies(strategyA, strategyB),
      spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt');

    strategyA.setActive(true);
    strategyB.setActive(true);

    expect(await strategies.attempt(new PlayerActionA(null))).true;
    expect(spyA).not.called;
    expect(spyB).called;
  });

  it('should return false if there are no successfully executed `Strategy`s', async () => {
    const strategyA = new Strategy(new RoutineFalse(PlayerActionA), testPlayer),
      strategyB = new Strategy(new RoutineFalse(PlayerActionA), testPlayer),
      strategyC = new Strategy(new RoutineFalse(PlayerActionA), testPlayer),
      strategies = new Strategies(strategyA, strategyB, strategyC),
      spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt'),
      spyC = spy.on(strategyC, 'attempt');

    strategyA.setActive(true);
    strategyB.setActive(true);
    strategyC.setActive(true);

    expect(await strategies.attempt(new PlayerActionA(null))).false;
    expect(spyA).called;
    expect(spyB).called;
    expect(spyC).called;
  });
});
