import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
import PriorityRule from './Rules/Priority';

export interface IStrategy {
  attempt(action: PlayerAction): boolean | Promise<boolean>;
  handles(action: PlayerAction): boolean;
  priority(action: PlayerAction): Priority;
}

export class Strategy implements IStrategy {
  private _ruleRegistry: RuleRegistry;

  constructor(ruleRegistry: RuleRegistry = ruleRegistryInstance) {
    this._ruleRegistry = ruleRegistry;
  }

  /**
   * Tries to handle the `action`, returning (or resolving to) `true` if it was handled, `false` otherwise.
   *
   * It can be `async`: `StrategyRegistry` awaits each attempt before it tries the next `Strategy`.
   */
  attempt(action: PlayerAction): boolean | Promise<boolean> {
    throw new Error('This must be overwritten in the implementor.');
  }

  /**
   * A cheap check that this `Strategy` could apply to the `action` at all, e.g. `action instanceof MyAction`.
   * `StrategyRegistry` skips a `Strategy` that returns `false` without evaluating its `Priority` rules or calling
   * `attempt`. It must not have side effects.
   */
  handles(action: PlayerAction): boolean {
    return true;
  }

  priority(action: PlayerAction): Priority {
    return new Priority(
      // This takes the highest priority (lowest value) from all the applicable `PriorityRule`s
      Math.min(
        ...this._ruleRegistry
          .process(PriorityRule, action, this)
          .map((priority) => priority.value()),
        Infinity
      )
    );
  }

  protected ruleRegistry(): RuleRegistry {
    return this._ruleRegistry;
  }
}

export default Strategy;
