import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
import PriorityRule from './Rules/Priority';
import classExtends from './lib/classExtends';

export interface IRoutine {
  attempt(action: PlayerAction): Promise<boolean>;
  canHandle(action: PlayerAction): boolean;
  priority(player: Player): Priority;
}

export class Routine implements IRoutine {
  #ruleRegistry: RuleRegistry = ruleRegistryInstance;
  #supportedPlayerActions: typeof PlayerAction[] = [];

  constructor(...items: (typeof PlayerAction | RuleRegistry)[]) {
    items.forEach((item) => {
      if (item instanceof RuleRegistry) {
        this.#ruleRegistry = item;

        return;
      }

      if (classExtends(item, PlayerAction)) {
        this.#supportedPlayerActions.push(item);

        return;
      }
    });
  }

  public attempt(action: PlayerAction): Promise<boolean> {
    throw new TypeError('`attempt` must be overridden.');
  }

  public canHandle(action: PlayerAction): boolean {
    return this.#supportedPlayerActions.some(
      (ActionType) => action instanceof ActionType
    );
  }

  public priority(player: Player): Priority {
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
