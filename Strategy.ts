import Normal from '@civ-clone/core-rule/Priorities/Normal';
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

export class Strategy implements IStrategy {
  #active: boolean = false;
  #priority: Priority = new Normal();
  #supportedPlayerActions: typeof PlayerAction[] = [];

  constructor(...items: (typeof PlayerAction | Priority)[]) {
    items.forEach((item) => {
      if (item instanceof Priority) {
        this.#priority = item;

        return;
      }

      if (
        typeof item === 'function' &&
        Object.prototype.isPrototypeOf.call(PlayerAction, item)
      ) {
        this.#supportedPlayerActions.push(item);

        return;
      }

      throw new TypeError(
        `Unsupported argument passed to ${this.constructor.name} constructor: ${item}`
      );
    });
  }

  public active(): boolean {
    return this.#active;
  }

  public setActive(active: boolean): void {
    this.#active = active;
  }

  /**
   * Checks to see if the `action` can be handled, returns `true` if it is, `false` otherwise.
   */
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

  public setPriority(priority: Priority): void {
    this.#priority = priority;
  }
}

export default Strategy;
