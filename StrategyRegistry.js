"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.StrategyRegistry = void 0;
const EntityRegistry_1 = require("@civ-clone/core-registry/EntityRegistry");
const Strategy_1 = require("./Strategy");
class StrategyRegistry extends EntityRegistry_1.default {
    constructor() {
        super(Strategy_1.default);
    }
    /**
     * Iterates all `Strategy`s ordered first by `Priority`, then by a random number so that alternative strategies are
     * tried.
     */
    attempt(action) {
        return this.entries()
            .sort((a, b) => a.priority(action).value() - b.priority(action).value() ||
            Math.floor(Math.random() * 3 - 1))
            .some((strategy) => strategy.attempt(action));
    }
}
exports.StrategyRegistry = StrategyRegistry;
exports.instance = new StrategyRegistry();
exports.default = StrategyRegistry;
//# sourceMappingURL=StrategyRegistry.js.map