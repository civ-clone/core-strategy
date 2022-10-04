"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Strategy_routines;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const Priority_1 = require("@civ-clone/core-rule/Priority");
class Strategy {
    constructor(...items) {
        _Strategy_routines.set(this, []);
        items.forEach((item) => __classPrivateFieldGet(this, _Strategy_routines, "f").push(item));
    }
    /**
     * Checks to see if the `action` can be handled, returns `true` if it is, `false` otherwise.
     */
    attempt(action) {
        return __classPrivateFieldGet(this, _Strategy_routines, "f")
            .sort((a, b) => a.priority(action.player()).value() -
            b.priority(action.player()).value())
            .some((routine) => routine.attempt(action));
    }
    priority(player) {
        return new Priority_1.default(Math.min(...__classPrivateFieldGet(this, _Strategy_routines, "f").map((routine) => routine.priority(player).value()), Infinity));
    }
}
exports.Strategy = Strategy;
_Strategy_routines = new WeakMap();
exports.default = Strategy;
//# sourceMappingURL=Strategy.js.map