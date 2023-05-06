import Strategy from '../../Strategy';

export class StrategyTrue extends Strategy {
  public attempt(): boolean {
    return true;
  }
}

export class StrategyFalse extends Strategy {
  public attempt(): boolean {
    return false;
  }
}

export class StrategyA extends StrategyTrue {}

export class StrategyB extends StrategyTrue {}
