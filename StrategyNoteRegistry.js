"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.StrategyNoteRegistry = void 0;
const EntityRegistry_1 = require("@civ-clone/core-registry/EntityRegistry");
class StrategyNoteRegistry extends EntityRegistry_1.default {
    getByKey(key) {
        return this.getBy('key', key);
    }
}
exports.StrategyNoteRegistry = StrategyNoteRegistry;
exports.instance = new StrategyNoteRegistry();
exports.default = StrategyNoteRegistry;
//# sourceMappingURL=StrategyNoteRegistry.js.map