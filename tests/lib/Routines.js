"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineFalse = exports.RoutineTrue = void 0;
const Routine_1 = require("../../Routine");
class RoutineTrue extends Routine_1.default {
    attempt() {
        return Promise.resolve(true);
    }
}
exports.RoutineTrue = RoutineTrue;
class RoutineFalse extends Routine_1.default {
    attempt() {
        return Promise.resolve(false);
    }
}
exports.RoutineFalse = RoutineFalse;
//# sourceMappingURL=Routines.js.map