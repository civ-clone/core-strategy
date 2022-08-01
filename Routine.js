"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Routine_priority, _Routine_supportedPlayerActions;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routine = void 0;
const Normal_1 = require("@civ-clone/core-rule/Priorities/Normal");
const PlayerAction_1 = require("@civ-clone/core-player/PlayerAction");
const Priority_1 = require("@civ-clone/core-rule/Priority");
class Routine {
    constructor(...items) {
        _Routine_priority.set(this, new Normal_1.default());
        _Routine_supportedPlayerActions.set(this, []);
        items.forEach((item) => {
            if (typeof item === 'function' &&
                Object.prototype.isPrototypeOf.call(PlayerAction_1.default, item)) {
                __classPrivateFieldGet(this, _Routine_supportedPlayerActions, "f").push(item);
                return;
            }
            if (item instanceof Priority_1.default) {
                __classPrivateFieldSet(this, _Routine_priority, item, "f");
            }
        });
    }
    attempt(action) {
        throw new TypeError('`attempt` must be overridden.');
    }
    canHandle(action) {
        return __classPrivateFieldGet(this, _Routine_supportedPlayerActions, "f").some((ActionType) => action instanceof ActionType);
    }
    priority() {
        return __classPrivateFieldGet(this, _Routine_priority, "f");
    }
}
exports.Routine = Routine;
_Routine_priority = new WeakMap(), _Routine_supportedPlayerActions = new WeakMap();
exports.default = Routine;
//# sourceMappingURL=Routine.js.map