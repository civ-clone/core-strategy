"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Routine_ruleRegistry, _Routine_supportedPlayerActions;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routine = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const PlayerAction_1 = require("@civ-clone/core-player/PlayerAction");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const Priority_2 = require("./Rules/Priority");
const classExtends_1 = require("./lib/classExtends");
class Routine {
    constructor(...items) {
        _Routine_ruleRegistry.set(this, RuleRegistry_1.instance);
        _Routine_supportedPlayerActions.set(this, []);
        items.forEach((item) => {
            if (item instanceof RuleRegistry_1.RuleRegistry) {
                __classPrivateFieldSet(this, _Routine_ruleRegistry, item, "f");
                return;
            }
            if ((0, classExtends_1.default)(item, PlayerAction_1.default)) {
                __classPrivateFieldGet(this, _Routine_supportedPlayerActions, "f").push(item);
                return;
            }
        });
    }
    attempt(action) {
        throw new TypeError('`attempt` must be overridden.');
    }
    canHandle(action) {
        return __classPrivateFieldGet(this, _Routine_supportedPlayerActions, "f").some((ActionType) => action instanceof ActionType);
    }
    priority(player) {
        return new Priority_1.default(
        // This takes the highest priority (lowest value) from all the applicable `PriorityRule`s
        Math.min(...__classPrivateFieldGet(this, _Routine_ruleRegistry, "f")
            .process(Priority_2.default, player, this)
            .map((priority) => priority.value()), Infinity));
    }
}
exports.Routine = Routine;
_Routine_ruleRegistry = new WeakMap(), _Routine_supportedPlayerActions = new WeakMap();
exports.default = Routine;
//# sourceMappingURL=Routine.js.map