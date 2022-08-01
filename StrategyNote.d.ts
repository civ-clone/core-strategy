declare type IDataObject = {
  id(): string;
};
export interface IStrategyNote {
  key(): string;
  value(): any;
}
export declare class StrategyNote implements IStrategyNote {
  #private;
  constructor(key: string, value: any);
  key(): string;
  value(): any;
}
export declare const generateKey: (
  ...items: (IDataObject | string)[]
) => string;
export default StrategyNote;
