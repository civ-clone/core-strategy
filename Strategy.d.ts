import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
import Routine from './Routine';
export interface IStrategy {
  active(): boolean;
  setActive(active: boolean): void;
  attempt(action: PlayerAction): Promise<boolean>;
  canHandle(action: PlayerAction): boolean;
  priority(): Priority;
  setPriority(priority: Priority): void;
}
export declare class Strategy implements IStrategy {
  #private;
  constructor(...items: (Player | Priority | Routine | RuleRegistry)[]);
  active(): boolean;
  setActive(active: boolean): void;
  /**
   * Checks to see if the `action` can be handled, returns `true` if it is, `false` otherwise.
   */
  attempt(action: PlayerAction): Promise<boolean>;
  canHandle(action: PlayerAction): boolean;
  priority(): Priority;
  setPriority(priority: Priority): void;
}
export default Strategy;
