import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
export interface IRoutine {
  attempt(action: PlayerAction): Promise<boolean>;
  priority(player: Player): Priority;
}
export declare class Routine implements IRoutine {
  #private;
  constructor(ruleRegistry?: RuleRegistry);
  attempt(action: PlayerAction): Promise<boolean>;
  priority(player: Player): Priority;
}
export default Routine;
