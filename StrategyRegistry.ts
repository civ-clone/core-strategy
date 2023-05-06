import EntityRegistry from '@civ-clone/core-registry/EntityRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from './Strategy';

export class StrategyRegistry extends EntityRegistry<Strategy> {
  constructor() {
    super(Strategy);
  }

  /**
   * Iterates all `Strategy`s ordered first by `Priority`, then by a random number so that alternative strategies are
   * tried.
   */
  attempt(action: PlayerAction): boolean {
    return this.entries()
      .sort(
        (a, b) =>
          a.priority(action).value() - b.priority(action).value() ||
          Math.floor(Math.random() * 3 - 1)
      )
      .some((strategy) => strategy.attempt(action));
  }
}

export const instance = new StrategyRegistry();

export default StrategyRegistry;
