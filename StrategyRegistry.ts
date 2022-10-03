import EntityRegistry from '@civ-clone/core-registry/EntityRegistry';
import Strategy from './Strategy';
import PlayerAction from '@civ-clone/core-player/PlayerAction';

export class StrategyRegistry extends EntityRegistry<Strategy> {
  constructor() {
    super(Strategy);
  }

  /**
   * Iterates all `Strategy`s ordered first by `Priority`, then by a random number so that alternative strategies are
   * tried.
   */
  attempt(action: PlayerAction): Promise<boolean> {
    return this.entries()
      .sort(
        (a, b) =>
          a.priority(action.player()).value() -
            b.priority(action.player()).value() ||
          Math.floor(Math.random() * 3 - 1)
      )
      .reduce(
        (promise, strategy) =>
          promise.then((result) => result || strategy.attempt(action)),
        Promise.resolve(false)
      );
  }
}

export const instance = new StrategyRegistry();

export default StrategyRegistry;
