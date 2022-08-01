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
var _Strategy_active, _Strategy_player, _Strategy_priority, _Strategy_routines, _Strategy_ruleRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const Created_1 = require("./Rules/Created");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Normal_1 = require("@civ-clone/core-rule/Priorities/Normal");
const Player_1 = require("@civ-clone/core-player/Player");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const Routine_1 = require("./Routine");
class Strategy {
    constructor(...items) {
        _Strategy_active.set(this, false);
        _Strategy_player.set(this, null);
        _Strategy_priority.set(this, new Normal_1.default());
        _Strategy_routines.set(this, []);
        _Strategy_ruleRegistry.set(this, RuleRegistry_1.instance);
        items.forEach((item) => {
            if (item instanceof Player_1.default) {
                __classPrivateFieldSet(this, _Strategy_player, item, "f");
                return;
            }
            if (item instanceof Priority_1.default) {
                __classPrivateFieldSet(this, _Strategy_priority, item, "f");
                return;
            }
            if (item instanceof Routine_1.default) {
                __classPrivateFieldGet(this, _Strategy_routines, "f").push(item);
                return;
            }
            if (item instanceof RuleRegistry_1.RuleRegistry) {
                __classPrivateFieldSet(this, _Strategy_ruleRegistry, item, "f");
                return;
            }
            throw new TypeError(`Unsupported argument passed to ${this.constructor.name} constructor: ${item}`);
        });
        if (__classPrivateFieldGet(this, _Strategy_player, "f") === null) {
            throw new TypeError('Missing `Player` object.');
        }
        __classPrivateFieldGet(this, _Strategy_routines, "f").sort((a, b) => a.priority().value() - b.priority().value());
        __classPrivateFieldGet(this, _Strategy_ruleRegistry, "f").process(Created_1.Created, this, __classPrivateFieldGet(this, _Strategy_player, "f"));
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
_Strategy_active = new WeakMap(), _Strategy_player = new WeakMap(), _Strategy_priority = new WeakMap(), _Strategy_routines = new WeakMap(), _Strategy_ruleRegistry = new WeakMap();
exports.default = Strategy;
//# sourceMappingURL=Strategy.js.map