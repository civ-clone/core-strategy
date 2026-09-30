"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const Priority_2 = require("./Rules/Priority");
class Strategy {
    constructor(ruleRegistry = RuleRegistry_1.instance) {
        this._ruleRegistry = ruleRegistry;
    }
    /**
     * Tries to handle the `action`, returning (or resolving to) `true` if it was handled, `false` otherwise.
     *
     * It can be `async`: `StrategyRegistry` awaits each attempt before it tries the next `Strategy`.
     */
    attempt(action) {
        throw new Error('This must be overwritten in the implementor.');
    }
    /**
     * A cheap check that this `Strategy` could apply to the `action` at all, e.g. `action instanceof MyAction`.
     * `StrategyRegistry` skips a `Strategy` that returns `false` without evaluating its `Priority` rules or calling
     * `attempt`. It must not have side effects.
     */
    handles(action) {
        return true;
    }
    priority(action) {
        return new Priority_1.default(
        // This takes the highest priority (lowest value) from all the applicable `PriorityRule`s
        Math.min(...this._ruleRegistry
            .process(Priority_2.default, action, this)
            .map((priority) => priority.value()), Infinity));
    }
    ruleRegistry() {
        return this._ruleRegistry;
    }
}
exports.Strategy = Strategy;
exports.default = Strategy;
//# sourceMappingURL=Strategy.js.map