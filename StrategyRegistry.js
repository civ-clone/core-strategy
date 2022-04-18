"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.StrategyRegistry = void 0;
const ConstructorRegistry_1 = require("@civ-clone/core-registry/ConstructorRegistry");
class StrategyRegistry extends ConstructorRegistry_1.default {
}
exports.StrategyRegistry = StrategyRegistry;
exports.instance = new StrategyRegistry();
exports.default = StrategyRegistry;
//# sourceMappingURL=StrategyRegistry.js.map