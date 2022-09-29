import Player from '@civ-clone/core-player/Player';
import PriorityValue from '@civ-clone/core-rule/Priority';
import Routine from '../Routine';
import Rule from '@civ-clone/core-rule/Rule';

export class Priority extends Rule<[Player, Routine], PriorityValue> {}

export default Priority;
