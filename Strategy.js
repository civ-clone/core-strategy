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
var _Strategy_active, _Strategy_priority, _Strategy_routines;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const Normal_1 = require("@civ-clone/core-rule/Priorities/Normal");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const Routine_1 = require("./Routine");
class Strategy {
    constructor(...items) {
        _Strategy_active.set(this, false);
        _Strategy_priority.set(this, new Normal_1.default());
        _Strategy_routines.set(this, []);
        items.forEach((item) => {
            if (item instanceof Priority_1.default) {
                __classPrivateFieldSet(this, _Strategy_priority, item, "f");
                return;
            }
            if (item instanceof Routine_1.default) {
                __classPrivateFieldGet(this, _Strategy_routines, "f").push(item);
                return;
            }
            throw new TypeError(`Unsupported argument passed to ${this.constructor.name} constructor: ${item}`);
        });
        __classPrivateFieldGet(this, _Strategy_routines, "f").sort((a, b) => a.priority().value() - b.priority().value());
    }
    active() {
        return __classPrivateFieldGet(this, _Strategy_active, "f");
    }
    setActive(active) {
        __classPrivateFieldSet(this, _Strategy_active, active, "f");
    }
    /**
     * Checks to see if the `action` can be handled, returns `true` if it is, `false` otherwise.
     */
    attempt(action) {
        return __classPrivateFieldGet(this, _Strategy_routines, "f")
            .filter((routine) => routine.canHandle(action))
            .reduce((promise, routine) => promise.then((result) => result || routine.attempt(action)), Promise.resolve(false));
    }
    canHandle(action) {
        return __classPrivateFieldGet(this, _Strategy_routines, "f").some((routine) => routine.canHandle(action));
    }
    priority() {
        return __classPrivateFieldGet(this, _Strategy_priority, "f");
    }
    setPriority(priority) {
        __classPrivateFieldSet(this, _Strategy_priority, priority, "f");
    }
}
exports.Strategy = Strategy;
_Strategy_active = new WeakMap(), _Strategy_priority = new WeakMap(), _Strategy_routines = new WeakMap();
exports.default = Strategy;
//# sourceMappingURL=Strategy.js.map