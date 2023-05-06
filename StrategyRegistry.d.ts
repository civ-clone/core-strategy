import EntityRegistry from '@civ-clone/core-registry/EntityRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from './Strategy';
export declare class StrategyRegistry extends EntityRegistry<Strategy> {
  constructor();
  /**
   * Iterates all `Strategy`s ordered first by `Priority`, then by a random number so that alternative strategies are
   * tried.
   */
  attempt(action: PlayerAction): boolean;
}
export declare const instance: StrategyRegistry;
export default StrategyRegistry;
