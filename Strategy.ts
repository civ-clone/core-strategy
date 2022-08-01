import { Created, ICreatedRegistry } from './Rules/Created';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Normal from '@civ-clone/core-rule/Priorities/Normal';
import Player from '@civ-clone/core-player/Player';
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
  #player: Player | null = null;
  #priority: Priority = new Normal();
  #routines: Routine[] = [];
  #ruleRegistry: RuleRegistry = ruleRegistryInstance;

  constructor(...items: (Player | Priority | Routine | RuleRegistry)[]) {
    items.forEach((item) => {
      if (item instanceof Player) {
        this.#player = item;

        return;
      }

      if (item instanceof Priority) {
        this.#priority = item;

        return;
      }

      if (item instanceof Routine) {
        this.#routines.push(item);

        return;
      }

      if (item instanceof RuleRegistry) {
        this.#ruleRegistry = item;

        return;
      }

      throw new TypeError(
        `Unsupported argument passed to ${this.constructor.name} constructor: ${item}`
      );
    });

    if (this.#player === null) {
      throw new TypeError('Missing `Player` object.');
    }

    this.#routines.sort((a, b) => a.priority().value() - b.priority().value());

    (this.#ruleRegistry as ICreatedRegistry).process(
      Created,
      this,
      this.#player
    );
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
