import EntityRegistry from '@civ-clone/core-registry/EntityRegistry';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Strategy from './Strategy';

export class StrategyRegistry extends EntityRegistry<Strategy> {
  /**
   * The random number generator is accepted but no longer used. Equal priorities were ordered by an RNG draw inside the
   * sort comparator, so how many numbers were drawn depended on the sort algorithm, and every draw moved the game's
   * seeded sequence. Ties now go to registration order. The argument stays so that existing callers
   * (`new StrategyRegistry(rng)` in `core-game`) keep working.
   */
  constructor(randomNumberGenerator?: () => number) {
    super(Strategy);
  }

  /**
   * Tries each `Strategy` that `handles` the `action`, in order (see `ordered`), one at a time, and stops at the first
   * that returns `true`. Resolves `true` if one did, `false` otherwise.
   */
  async attempt(action: PlayerAction): Promise<boolean> {
    for (const strategy of this.ordered(action)) {
      if (await strategy.attempt(action)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Runs every `Strategy` that `handles` the `action`, in the same order as `attempt`, whatever each returns. Resolves
   * `true` if any returned `true`. This is for actions that several plugins each contribute to, such as a per-turn hook.
   */
  async attemptAll(action: PlayerAction): Promise<boolean> {
    let handled = false;

    for (const strategy of this.ordered(action)) {
      if (await strategy.attempt(action)) {
        handled = true;
      }
    }

    return handled;
  }

  /**
   * The `Strategy`s that `handle` the `action`, ordered by `Priority` value, lowest (highest priority) first, then by
   * registration order. Each `Strategy`'s priority is computed once.
   */
  protected ordered(action: PlayerAction): Strategy[] {
    return this.entries()
      .filter((strategy: Strategy): boolean => strategy.handles(action))
      .map((strategy: Strategy, index: number) => ({
        index,
        priority: strategy.priority(action).value(),
        strategy,
      }))
      .sort(
        (a, b): number =>
          // Not `a.priority - b.priority`, which is `NaN` when both are `Infinity` (no `Priority` rule applies).
          (a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0) ||
          a.index - b.index
      )
      .map(({ strategy }): Strategy => strategy);
  }
}

export const instance = new StrategyRegistry();

export default StrategyRegistry;
