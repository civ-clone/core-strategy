declare type IDataObject = {
  id(): string;
};
export interface IStrategyNote<Value = any> {
  key(): string;
  value(): Value;
}
export declare class StrategyNote<Value = any> implements IStrategyNote<Value> {
  #private;
  constructor(key: string, value: Value);
  key(): string;
  value(): Value;
}
export declare const generateKey: (
  ...items: (IDataObject | string)[]
) => string;
export default StrategyNote;
