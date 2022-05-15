import Normal from '@civ-clone/core-rule/Priorities/Normal';
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

export class Strategy implements IStrategy {
  #active: boolean = false;
  #priority: Priority = new Normal();
  #routines: Routine[] = [];

  constructor(...items: (Priority | Routine)[]) {
    items.forEach((item) => {
      if (item instanceof Priority) {
        this.#priority = item;

        return;
      }

      if (item instanceof Routine) {
        this.#routines.push(item);

        return;
      }

      throw new TypeError(
        `Unsupported argument passed to ${this.constructor.name} constructor: ${item}`
      );
    });

    this.#routines.sort((a, b) => a.priority().value() - b.priority().value());
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
    return this.#routines
      .filter((routine) => routine.canHandle(action))
      .reduce(
        (promise, routine) =>
          promise.then((result) => result || routine.attempt(action)),
        Promise.resolve(false)
      );
  }

  public canHandle(action: PlayerAction): boolean {
    return this.#routines.some((routine) => routine.canHandle(action));
  }

  public priority(): Priority {
    return this.#priority;
  }

  public setPriority(priority: Priority): void {
    this.#priority = priority;
  }
}

export default Strategy;
