import { RoutineFalse, RoutineTrue } from './lib/Routines';
import { expect, spy, use } from 'chai';
import Player from '@civ-clone/core-player/Player';
import { PlayerAction } from './lib/PlayerActions';
import Strategy from '../Strategy';
import StrategyRegistry from '../StrategyRegistry';
import * as spies from 'chai-spies';

use(spies);

describe('StrategyRegistry', () => {
  const testPlayer = new Player();

  it('should filter inactive `Strategy`s', async () => {
    const strategyA = new Strategy(new RoutineTrue()),
      strategyB = new Strategy(new RoutineTrue()),
      strategyRegistry = new StrategyRegistry(),
      spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt');

    strategyRegistry.register(strategyA, strategyB);

    expect(await strategyRegistry.attempt(new PlayerAction(testPlayer, null)))
      .true;
    expect(spyA).not.called;
    expect(spyB).called;
  });

  it('should stop calling `Strategy`s after the first successful `attempt()`', async () => {
    const strategyA = new Strategy(new RoutineTrue()),
      strategyB = new Strategy(new RoutineFalse()),
      strategyRegistry = new StrategyRegistry(),
      spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt');

    strategyRegistry.register(strategyA, strategyB);

    expect(await strategyRegistry.attempt(new PlayerAction(testPlayer, null)))
      .true;
    expect(spyA).called;
    expect(spyB).not.called;
  });

  it('should respect `Strategy` `Priority`s', async () => {
    const routine = new RoutineTrue(),
      strategyA = new Strategy(routine),
      strategyB = new Strategy(routine),
      strategyRegistry = new StrategyRegistry(),
      spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt');

    strategyRegistry.register(strategyA, strategyB);

    expect(await strategyRegistry.attempt(new PlayerAction(testPlayer, null)))
      .true;
    expect(spyA).not.called;
    expect(spyB).called;
  });

  it('should return false if there are no successfully executed `Strategy`s', async () => {
    const strategyA = new Strategy(new RoutineFalse()),
      strategyB = new Strategy(new RoutineFalse()),
      strategyC = new Strategy(new RoutineFalse()),
      strategyRegistry = new StrategyRegistry(),
      spyA = spy.on(strategyA, 'attempt'),
      spyB = spy.on(strategyB, 'attempt'),
      spyC = spy.on(strategyC, 'attempt');

    strategyRegistry.register(strategyA, strategyB, strategyC);

    expect(await strategyRegistry.attempt(new PlayerAction(testPlayer, null)))
      .false;
    expect(spyA).called;
    expect(spyB).called;
    expect(spyC).called;
  });
});
