"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Strategies_strategies;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategies = void 0;
class Strategies {
    constructor(...strategies) {
        _Strategies_strategies.set(this, []);
        strategies.forEach((strategy) => __classPrivateFieldGet(this, _Strategies_strategies, "f").push(strategy));
    }
    /**
     * Iterates all `Strategy`s ordered first by `Priority`, then by a random number so that alternative strategies are
     * tried.
     */
    attempt(action) {
        return [...__classPrivateFieldGet(this, _Strategies_strategies, "f")]
            .filter((strategy) => strategy.active() && strategy.canHandle(action))
            .sort((a, b) => a.priority().value() - b.priority().value() ||
            Math.floor(Math.random() * 3 - 1))
            .reduce((promise, strategy) => promise.then((result) => result || strategy.attempt(action)), Promise.resolve(false));
    }
}
exports.Strategies = Strategies;
_Strategies_strategies = new WeakMap();
exports.default = Strategies;
//# sourceMappingURL=Strategies.js.map