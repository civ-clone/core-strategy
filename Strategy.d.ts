import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
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
  constructor(...items: (typeof PlayerAction | Priority)[]);
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
