import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
import Normal from '@civ-clone/core-rule/Priorities/Normal';

export interface IRoutine {
  attempt(action: PlayerAction): Promise<boolean>;
  priority(): Priority;
}

export class Routine implements IRoutine {
  #priority: Priority = new Normal();
  #supportedPlayerActions: typeof PlayerAction[] = [];

  constructor(...items: (Priority | typeof PlayerAction)[]) {
    items.forEach((item) => {
      if (
        typeof item === 'function' &&
        Object.prototype.isPrototypeOf.call(PlayerAction, item)
      ) {
        this.#supportedPlayerActions.push(item as typeof PlayerAction);

        return;
      }

      if (item instanceof Priority) {
        this.#priority = item;
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

  public priority(): Priority {
    return this.#priority;
  }
}

export default Routine;
