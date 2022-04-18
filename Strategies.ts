import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from './Strategy';

export interface IStrategies {
  attempt(action: PlayerAction): Promise<boolean>;
}

export class Strategies implements IStrategies {
  #strategies: Strategy[] = [];

  constructor(...strategies: Strategy[]) {
    strategies.forEach((strategy) => this.#strategies.push(strategy));
  }

  /**
   * Iterates all `Strategy`s ordered first by `Priority`, then by a random number so that alternative strategies are
   * tried.
   */
  public attempt(action: PlayerAction): Promise<boolean> {
    return [...this.#strategies]
      .filter((strategy) => strategy.active() && strategy.canHandle(action))
      .sort(
        (a, b) =>
          a.priority().value() - b.priority().value() ||
          Math.floor(Math.random() * 3 - 1)
      )
      .reduce(
        (promise, strategy) =>
          promise.then((result) => result || strategy.attempt(action)),
        Promise.resolve(false)
      );
  }
}

export default Strategies;
