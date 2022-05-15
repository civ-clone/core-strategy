import High from '@civ-clone/core-rule/Priorities/High';
import { PlayerActionA } from './lib/PlayerActions';
import { RoutineTrue, RoutineFalse } from './lib/Routines';
import Strategies from '../Strategies';
import Strategy from '../Strategy';
import { expect, spy, use } from 'chai';
import * as spies from 'chai-spies';

use(spies);

describe('Strategies', () => {
  it('should filter inactive `Strategy`s', async () => {
    const strategyA = new Strategy(new RoutineTrue(PlayerActionA)),
      strategyB = new Strategy(new RoutineTrue(PlayerActionA)),
      strategies = new Strategies(strategyA, strategyB),
      spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt');

    strategyB.setActive(true);

    expect(await strategies.attempt(new PlayerActionA(null))).true;
    expect(spyA).not.called;
    expect(spyB).called;
  });

  it('should stop calling `Strategy`s after the first successful `attempt()`', async () => {
    const strategyA = new Strategy(new RoutineTrue(PlayerActionA)),
      strategyB = new Strategy(new RoutineFalse(PlayerActionA)),
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
      strategyA = new Strategy(routine),
      strategyB = new Strategy(routine, new High()),
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
    const strategyA = new Strategy(new RoutineFalse(PlayerActionA)),
      strategyB = new Strategy(new RoutineFalse(PlayerActionA)),
      strategyC = new Strategy(new RoutineFalse(PlayerActionA)),
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
