import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Priority from '@civ-clone/core-rule/Priority';
export interface IRoutine {
  attempt(action: PlayerAction): Promise<boolean>;
  priority(): Priority;
}
export declare class Routine implements IRoutine {
  #private;
  constructor(...items: (Priority | typeof PlayerAction)[]);
  attempt(action: PlayerAction): Promise<boolean>;
  canHandle(action: PlayerAction): boolean;
  priority(): Priority;
}
export default Routine;
