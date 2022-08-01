import { IRuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import Rule from '@civ-clone/core-rule/Rule';
import Strategy from '../Strategy';

export class Created extends Rule<[Strategy, Player], void> {}

export interface ICreatedRegistry
  extends IRuleRegistry<Created, [Strategy, Player], void> {}

export default Created;
