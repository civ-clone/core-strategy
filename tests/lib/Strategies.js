"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyB = exports.StrategyA = exports.StrategyFalse = exports.StrategyTrue = void 0;
const Strategy_1 = require("../../Strategy");
class StrategyTrue extends Strategy_1.default {
    attempt() {
        return true;
    }
}
exports.StrategyTrue = StrategyTrue;
class StrategyFalse extends Strategy_1.default {
    attempt() {
        return false;
    }
}
exports.StrategyFalse = StrategyFalse;
class StrategyA extends StrategyTrue {
}
exports.StrategyA = StrategyA;
class StrategyB extends StrategyTrue {
}
exports.StrategyB = StrategyB;
//# sourceMappingURL=Strategies.js.map