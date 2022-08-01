import DataObject from '@civ-clone/core-data-object/DataObject';

type IDataObject = {
  id(): string;
};

export interface IStrategyNote {
  key(): string;
  value(): any;
}

export class StrategyNote implements IStrategyNote {
  #key: string;
  #value: any;

  constructor(key: string, value: any) {
    this.#key = key;
    this.#value = value;
  }

  public key(): string {
    return this.#key;
  }

  public value(): any {
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
