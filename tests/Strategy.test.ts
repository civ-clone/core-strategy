import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from '../Strategy';
import { expect } from 'chai';

describe('Strategy', () => {
  it('should default to `Normal` `Priority`', () =>
    expect(new Strategy().priority().value()).eq(2000));

  it('should be possible to limit the `PlayerAction`s that can be handled', () => {
    const A = class extends PlayerAction {},
      B = class extends PlayerAction {},
      AStrategy = class extends Strategy {},
      strategy = new AStrategy(A);

    expect(strategy.canHandle(new B(null))).false;
    expect(strategy.canHandle(new A(null))).true;
  });
});
