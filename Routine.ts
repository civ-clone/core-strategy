import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
import PriorityRule from './Rules/Priority';

export interface IRoutine {
  attempt(action: PlayerAction): Promise<boolean>;
  priority(player: Player): Priority;
}

export class Routine implements IRoutine {
  #ruleRegistry: RuleRegistry;

  constructor(ruleRegistry: RuleRegistry = ruleRegistryInstance) {
    this.#ruleRegistry = ruleRegistry;
  }

  attempt(action: PlayerAction): Promise<boolean> {
    throw new TypeError('`attempt` must be overridden.');
  }

  priority(player: Player): Priority {
    return new Priority(
      // This takes the highest priority (lowest value) from all the applicable `PriorityRule`s
      Math.min(
        ...this.#ruleRegistry
          .process(PriorityRule, player, this)
          .map((priority) => priority.value()),
        Infinity
      )
    );
  }
}

export default Routine;
