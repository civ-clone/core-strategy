import DataObject from '@civ-clone/core-data-object/DataObject';

type IDataObject = {
  id(): string;
};

export interface IStrategyNote<Value = any> {
  key(): string;
  value(): Value;
}

export class StrategyNote<Value = any> implements IStrategyNote<Value> {
  #key: string;
  #value: any;

  constructor(key: string, value: Value) {
    this.#key = key;
    this.#value = value;
  }

  public key(): string {
    return this.#key;
  }

  public value(): Value {
    return this.#value;
  }
}

export const generateKey: (...items: (IDataObject | string)[]) => string = (
  ...items: (IDataObject | string)[]
) =>
  items
    .map((item) =>
      item instanceof DataObject
        ? item.id()
        : typeof item === 'string'
        ? item
        : item.toString()
    )
    .join('-');

export default StrategyNote;
