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
export default StrategyNote;
