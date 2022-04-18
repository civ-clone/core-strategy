import ConstructorRegistry from '@civ-clone/core-registry/ConstructorRegistry';
import Strategy from './Strategy';

export class StrategyRegistry extends ConstructorRegistry<Strategy> {}

export const instance = new StrategyRegistry();

export default StrategyRegistry;
