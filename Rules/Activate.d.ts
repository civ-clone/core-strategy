import { IRuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Rule from '@civ-clone/core-rule/Rule';
import Strategy from '../Strategy';
declare type ActiveArgs = [Strategy];
export declare class Activate extends Rule<ActiveArgs, boolean> {}
export default Activate;
export interface IActiveRegistry
  extends IRuleRegistry<Activate, ActiveArgs, boolean> {}
