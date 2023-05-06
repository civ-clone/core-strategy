import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
import PriorityRule from './Rules/Priority';

export interface IStrategy {
  attempt(action: PlayerAction): boolean;
  priority(action: PlayerAction): Priority;
}

export class Strategy implements IStrategy {
  #ruleRegistry: RuleRegistry;

  constructor(ruleRegistry: RuleRegistry = ruleRegistryInstance) {
    this.#ruleRegistry = ruleRegistry;
  }

  /**
   * Checks to see if the `action` can be handled, returns `true` if it is, `false` otherwise.
   */
  attempt(action: PlayerAction): boolean {
    throw new Error('This must be overwritten in the implementor.');
  }

  priority(action: PlayerAction): Priority {
    return new Priority(
      // This takes the highest priority (lowest value) from all the applicable `PriorityRule`s
      Math.min(
        ...this.#ruleRegistry
          .process(PriorityRule, action, this)
          .map((priority) => priority.value()),
        Infinity
      )
    );
  }

  protected ruleRegistry(): RuleRegistry {
    return this.#ruleRegistry;
  }
}

export default Strategy;
