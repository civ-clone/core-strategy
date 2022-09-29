"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraitNone = exports.TraitHalf = exports.TraitFull = exports.TraitType = void 0;
const Trait_1 = require("@civ-clone/core-civilization/Trait");
class TraitType extends Trait_1.default {
}
exports.TraitType = TraitType;
class TraitFull extends TraitType {
    constructor(leader) {
        super(leader, 1);
    }
}
exports.TraitFull = TraitFull;
class TraitHalf extends TraitType {
    constructor(leader) {
        super(leader, 0.5);
    }
}
exports.TraitHalf = TraitHalf;
class TraitNone extends TraitType {
    constructor(leader) {
        super(leader, 0);
    }
}
exports.TraitNone = TraitNone;
//# sourceMappingURL=Traits.js.map