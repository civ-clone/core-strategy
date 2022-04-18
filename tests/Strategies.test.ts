import High from '@civ-clone/core-rule/Priorities/High';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategies from '../Strategies';
import Strategy from '../Strategy';
import { expect, spy, use } from 'chai';
import * as spies from 'chai-spies';

use(spies);

describe('Strategies', () => {
  const A = class extends Strategy {
      async attempt(action: PlayerAction): Promise<boolean> {
        return true;
      }
    },
    B = class extends Strategy {
      async attempt(action: PlayerAction): Promise<boolean> {
        return true;
      }
    },
    ActionA = class extends PlayerAction {};

  it('should filter inactive `Strategy`s', async () => {
    const a = new A(ActionA),
      b = new B(ActionA),
      strategies = new Strategies(a, b),
      spyA = spy.on(a, 'attempt'),
      spyB = spy.on(b, 'attempt');

    b.setActive(true);

    expect(await strategies.attempt(new ActionA(null))).true;
    expect(spyA).not.called;
    expect(spyB).called;
  });

  it('should only call the first successful `Strategy`', async () => {
    const a = new A(ActionA),
      b = new B(ActionA),
      strategies = new Strategies(a, b),
      spyA = spy.on(a, 'attempt'),
      spyB = spy.on(b, 'attempt');

    a.setActive(true);
    b.setActive(true);

    expect(await strategies.attempt(new ActionA(null))).true;
    expect(spyA).called;
    expect(spyB).not.called;
  });

  it('should respect `Strategy` `Priority`', async () => {
    const a = new A(ActionA),
      b = new B(new High(), ActionA),
      strategies = new Strategies(a, b),
      spyA = spy.on(a, 'attempt'),
      spyB = spy.on(b, 'attempt');

    a.setActive(true);
    b.setActive(true);

    expect(await strategies.attempt(new ActionA(null))).true;
    expect(spyA).not.called;
    expect(spyB).called;
  });

  it('should return false if there are no successfully executed `Strategy`s', async () => {
    const A = class extends Strategy {
        async attempt(action: PlayerAction): Promise<boolean> {
          return false;
        }
      },
      a = new A(ActionA),
      b = new A(ActionA),
      c = new A(ActionA),
      strategies = new Strategies(a, b, c),
      spyA = spy.on(a, 'attempt'),
      spyB = spy.on(b, 'attempt'),
      spyC = spy.on(c, 'attempt');

    a.setActive(true);
    b.setActive(true);
    c.setActive(true);

    expect(await strategies.attempt(new ActionA(null))).false;
    expect(spyA).called;
    expect(spyB).called;
    expect(spyC).called;
  });
});
