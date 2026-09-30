"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.StrategyRegistry = void 0;
const EntityRegistry_1 = require("@civ-clone/core-registry/EntityRegistry");
const Strategy_1 = require("./Strategy");
class StrategyRegistry extends EntityRegistry_1.default {
    /**
     * The random number generator is accepted but no longer used. Equal priorities were ordered by an RNG draw inside the
     * sort comparator, so how many numbers were drawn depended on the sort algorithm, and every draw moved the game's
     * seeded sequence. Ties now go to registration order. The argument stays so that existing callers
     * (`new StrategyRegistry(rng)` in `core-game`) keep working.
     */
    constructor(randomNumberGenerator) {
        super(Strategy_1.default);
    }
    /**
     * Tries each `Strategy` that `handles` the `action`, in order (see `ordered`), one at a time, and stops at the first
     * that returns `true`. Resolves `true` if one did, `false` otherwise.
     */
    async attempt(action) {
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
    async attemptAll(action) {
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
    ordered(action) {
        return this.entries()
            .filter((strategy) => strategy.handles(action))
            .map((strategy, index) => ({
            index,
            priority: strategy.priority(action).value(),
            strategy,
        }))
            .sort((a, b) => 
        // Not `a.priority - b.priority`, which is `NaN` when both are `Infinity` (no `Priority` rule applies).
        (a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0) ||
            a.index - b.index)
            .map(({ strategy }) => strategy);
    }
}
exports.StrategyRegistry = StrategyRegistry;
exports.instance = new StrategyRegistry();
exports.default = StrategyRegistry;
//# sourceMappingURL=StrategyRegistry.js.map