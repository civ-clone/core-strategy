"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.StrategyNoteRegistry = void 0;
const EntityRegistry_1 = require("@civ-clone/core-registry/EntityRegistry");
const StrategyNote_1 = require("./StrategyNote");
class StrategyNoteRegistry extends EntityRegistry_1.EntityRegistry {
    constructor() {
        super(StrategyNote_1.default);
        // A note's key is fixed for its lifetime: `StrategyNote` has no setter, and `replace` swaps one note for another rather
        // than re-keying it. So the index never needs a `reindex`. A note restored from a save is filled before it is
        // registered, so it is filed under its key like any other.
        this._byKey = this.index((note) => note.key());
    }
    getByKey(key) {
        return this._byKey.get(key)[0];
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
            super.register(entity);
        });
    }
    replace(...entities) {
        entities.forEach((entity) => {
            const existing = this.getByKey(entity.key());
            if (existing) {
                this.unregister(existing);
            }
            this.register(entity);
        });
    }
}
exports.StrategyNoteRegistry = StrategyNoteRegistry;
exports.instance = new StrategyNoteRegistry();
exports.default = StrategyNoteRegistry;
//# sourceMappingURL=StrategyNoteRegistry.js.map