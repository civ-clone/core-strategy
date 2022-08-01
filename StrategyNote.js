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
var _StrategyNote_key, _StrategyNote_value;
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.StrategyNote = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class StrategyNote {
    constructor(key, value) {
        _StrategyNote_key.set(this, void 0);
        _StrategyNote_value.set(this, void 0);
        __classPrivateFieldSet(this, _StrategyNote_key, key, "f");
        __classPrivateFieldSet(this, _StrategyNote_value, value, "f");
    }
    key() {
        return __classPrivateFieldGet(this, _StrategyNote_key, "f");
    }
    value() {
        return __classPrivateFieldGet(this, _StrategyNote_value, "f");
    }
}
exports.StrategyNote = StrategyNote;
_StrategyNote_key = new WeakMap(), _StrategyNote_value = new WeakMap();
const generateKey = (...items) => items
    .map((item) => item instanceof DataObject_1.default
    ? item.id()
    : typeof item === 'string'
        ? item
        : item.toString())
    .join('-');
exports.generateKey = generateKey;
exports.default = StrategyNote;
//# sourceMappingURL=StrategyNote.js.map