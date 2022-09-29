export const classExtends = <P extends NewableFunction>(
  child: NewableFunction,
  parent: P
): child is P =>
  typeof child === 'function' &&
  (Object.prototype.isPrototypeOf.call(parent, child) || child === parent);

export default classExtends;
