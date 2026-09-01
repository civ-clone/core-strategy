import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';

export interface IStrategyNote<Value = any> {
  key(): string;
  value(): Value;
}

export class StrategyNote<Value = any> implements IStrategyNote<Value> {
  private _key: string;
  private _value: Value;

  constructor(key: string, value: Value) {
    this._key = key;
    this._value = value;
  }

  public key(): string {
    return this._key;
  }

  public value(): Value {
    return this._value;
  }
}

export const generateKey: (
  ...items: (Pick<IDataObject, 'id'> | string)[]
) => string = (...items: (Pick<IDataObject, 'id'> | string)[]) =>
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
