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
        return this.handleableStrategies(action).reduce((promise, strategy) => promise.then((result) => result || strategy.attempt(action)), Promise.resolve(false));
    }
    handleableStrategies(action) {
        return this.filter((strategy) => strategy.canHandle(action)).sort((a, b) => a.priority(action.player()).value() -
            b.priority(action.player()).value() ||
            Math.floor(Math.random() * 3 - 1));
    }
}
exports.StrategyRegistry = StrategyRegistry;
exports.instance = new StrategyRegistry();
exports.default = StrategyRegistry;
//# sourceMappingURL=StrategyRegistry.js.map