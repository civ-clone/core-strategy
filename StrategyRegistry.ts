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
    return this.handleableStrategies(action).reduce(
      (promise, strategy) =>
        promise.then((result) => result || strategy.attempt(action)),
      Promise.resolve(false)
    );
  }

  handleableStrategies(action: PlayerAction): Strategy[] {
    return this.filter((strategy) => strategy.canHandle(action)).sort(
      (a, b) =>
        a.priority(action.player()).value() -
          b.priority(action.player()).value() ||
        Math.floor(Math.random() * 3 - 1)
    );
  }
}

export const instance = new StrategyRegistry();

export default StrategyRegistry;
