import Strategy from '../../Strategy';
export declare class StrategyTrue extends Strategy {
  attempt(): boolean;
}
export declare class StrategyFalse extends Strategy {
  attempt(): boolean;
}
export declare class StrategyA extends StrategyTrue {}
export declare class StrategyB extends StrategyTrue {}
