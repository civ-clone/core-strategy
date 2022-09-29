import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
import Routine from './Routine';

export interface IStrategy {
  attempt(action: PlayerAction): Promise<boolean>;
  canHandle(action: PlayerAction): boolean;
  priority(player: Player): Priority;
}

export class Strategy implements IStrategy {
  #routines: Routine[] = [];

  constructor(...items: Routine[]) {
    items.forEach((item) => this.#routines.push(item));
  }

  /**
   * Checks to see if the `action` can be handled, returns `true` if it is, `false` otherwise.
   */
  attempt(action: PlayerAction): Promise<boolean> {
    return this.#routines
      .sort(
        (a, b) =>
          a.priority(action.player()).value() -
          b.priority(action.player()).value()
      )
      .filter((routine) => routine.canHandle(action))
      .reduce(
        (promise, routine) =>
          promise.then((result) => result || routine.attempt(action)),
        Promise.resolve(false)
      );
  }

  canHandle(action: PlayerAction): boolean {
    return this.#routines.some((routine) => routine.canHandle(action));
  }

  priority(player: Player): Priority {
    return new Priority(
      Math.min(
        ...this.#routines.map((routine) => routine.priority(player).value()),
        Infinity
      )
    );
  }
}

export default Strategy;
