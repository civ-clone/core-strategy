import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from './Strategy';
export interface IStrategies {
  attempt(action: PlayerAction): Promise<boolean>;
}
export declare class Strategies implements IStrategies {
  #private;
  constructor(...strategies: Strategy[]);
  /**
   * Iterates all `Strategy`s ordered first by `Priority`, then by a random number so that alternative strategies are
   * tried.
   */
  attempt(action: PlayerAction): Promise<boolean>;
}
export default Strategies;
