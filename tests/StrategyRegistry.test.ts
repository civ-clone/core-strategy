import { StrategyFalse, StrategyTrue } from './lib/Strategies';
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
    const strategyA = new StrategyTrue(),
      strategyB = new Strategy(),
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
    const strategyA = new StrategyTrue(),
      strategyB = new StrategyFalse(),
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
    const strategyA = new StrategyTrue(),
      strategyB = new StrategyTrue(),
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
    const strategyA = new StrategyFalse(),
      strategyB = new StrategyFalse(),
      strategyC = new StrategyFalse(),
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
