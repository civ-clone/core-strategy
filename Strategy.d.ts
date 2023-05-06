import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
export interface IStrategy {
  attempt(action: PlayerAction): boolean;
  priority(action: PlayerAction): Priority;
}
export declare class Strategy implements IStrategy {
  #private;
  constructor(ruleRegistry?: RuleRegistry);
  /**
   * Checks to see if the `action` can be handled, returns `true` if it is, `false` otherwise.
   */
  attempt(action: PlayerAction): boolean;
  priority(action: PlayerAction): Priority;
  protected ruleRegistry(): RuleRegistry;
}
export default Strategy;
