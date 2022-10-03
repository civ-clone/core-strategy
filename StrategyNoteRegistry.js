"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.StrategyNoteRegistry = void 0;
const EntityRegistry_1 = require("@civ-clone/core-registry/EntityRegistry");
const StrategyNote_1 = require("./StrategyNote");
class StrategyNoteRegistry extends EntityRegistry_1.default {
    getByKey(key) {
        return this.getBy('key', key)[0];
    }
    getOrCreateByKey(key, value) {
        const existing = this.getByKey(key);
        if (existing) {
            return existing;
        }
        const note = new StrategyNote_1.default(key, value);
        this.register(note);
        return note;
    }
    register(...entities) {
        entities.forEach((entity) => {
            if (this.getByKey(entity.key())) {
                throw new TypeError(`Entity with key '${entity.key()}' already exists.`);
            }
        });
    }
}
exports.StrategyNoteRegistry = StrategyNoteRegistry;
exports.instance = new StrategyNoteRegistry();
exports.default = StrategyNoteRegistry;
//# sourceMappingURL=StrategyNoteRegistry.js.map