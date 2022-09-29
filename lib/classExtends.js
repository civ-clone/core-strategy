"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classExtends = void 0;
const classExtends = (child, parent) => typeof child === 'function' &&
    (Object.prototype.isPrototypeOf.call(parent, child) || child === parent);
exports.classExtends = classExtends;
exports.default = exports.classExtends;
//# sourceMappingURL=classExtends.js.map