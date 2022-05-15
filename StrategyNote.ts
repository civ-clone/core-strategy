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

export default StrategyNote;
