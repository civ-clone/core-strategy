import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
export interface IStrategy {
  attempt(action: PlayerAction): boolean | Promise<boolean>;
  handles(action: PlayerAction): boolean;
  priority(action: PlayerAction): Priority;
}
export declare class Strategy implements IStrategy {
  private _ruleRegistry;
  constructor(ruleRegistry?: RuleRegistry);
  /**
   * Tries to handle the `action`, returning (or resolving to) `true` if it was handled, `false` otherwise.
   *
   * It can be `async`: `StrategyRegistry` awaits each attempt before it tries the next `Strategy`.
   */
  attempt(action: PlayerAction): boolean | Promise<boolean>;
  /**
   * A cheap check that this `Strategy` could apply to the `action` at all, e.g. `action instanceof MyAction`.
   * `StrategyRegistry` skips a `Strategy` that returns `false` without evaluating its `Priority` rules or calling
   * `attempt`. It must not have side effects.
   */
  handles(action: PlayerAction): boolean;
  priority(action: PlayerAction): Priority;
  protected ruleRegistry(): RuleRegistry;
}
export default Strategy;
