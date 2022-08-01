import { PlayerActionA, PlayerActionB } from './lib/PlayerActions';
import High from '@civ-clone/core-rule/Priorities/High';
import Low from '@civ-clone/core-rule/Priorities/Low';
import Normal from '@civ-clone/core-rule/Priorities/Normal';
import Routine from '../Routine';
import { expect } from 'chai';

describe('Routine', () => {
  it('should default to `Normal` `Priority`', () => {
    const routine = new Routine();

    expect(routine.priority()).instanceOf(Normal);
  });

  it('should be possible to override `Priority`', () => {
    const lowRoutine = new Routine(new Low()),
      highRoutine = new Routine(new High());

    expect(lowRoutine.priority()).instanceOf(Low);
    expect(lowRoutine.priority().value()).to.equal(3000);
    expect(highRoutine.priority()).instanceOf(High);
    expect(highRoutine.priority().value()).to.equal(1000);
  });

  it('should be possible to limit the `PlayerAction`s that can be handled', async () => {
    const routine = new Routine(PlayerActionA);

    expect(routine.canHandle(new PlayerActionB(null))).false;
    expect(routine.canHandle(new PlayerActionA(null))).true;
  });
});
