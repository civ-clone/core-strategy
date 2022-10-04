import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
import Routine from './Routine';
export interface IStrategy {
  attempt(action: PlayerAction): boolean;
  priority(player: Player): Priority;
}
export declare class Strategy implements IStrategy {
  #private;
  constructor(...items: Routine[]);
  /**
   * Checks to see if the `action` can be handled, returns `true` if it is, `false` otherwise.
   */
  attempt(action: PlayerAction): boolean;
  priority(player: Player): Priority;
}
export default Strategy;
