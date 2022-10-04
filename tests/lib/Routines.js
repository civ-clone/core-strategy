"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineB = exports.RoutineA = exports.RoutineFalse = exports.RoutineTrue = void 0;
const Routine_1 = require("../../Routine");
class RoutineTrue extends Routine_1.default {
    attempt() {
        return true;
    }
}
exports.RoutineTrue = RoutineTrue;
class RoutineFalse extends Routine_1.default {
    attempt() {
        return false;
    }
}
exports.RoutineFalse = RoutineFalse;
class RoutineA extends RoutineTrue {
}
exports.RoutineA = RoutineA;
class RoutineB extends RoutineTrue {
}
exports.RoutineB = RoutineB;
//# sourceMappingURL=Routines.js.map