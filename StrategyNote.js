"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.StrategyNote = void 0;
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class StrategyNote {
    constructor(key, value) {
        this._key = key;
        this._value = value;
    }
    key() {
        return this._key;
    }
    value() {
        return this._value;
    }
}
exports.StrategyNote = StrategyNote;
const generateKey = (...items) => items
    .map((item) => item instanceof DataObject_1.DataObject
    ? item.id()
    : typeof item === 'string'
        ? item
        : item.toString())
    .join('-');
exports.generateKey = generateKey;
exports.default = StrategyNote;
//# sourceMappingURL=StrategyNote.js.map