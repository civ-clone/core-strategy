import PlayerAction from '@civ-clone/core-player/PlayerAction';
import PriorityValue from '@civ-clone/core-rule/Priority';
import Rule from '@civ-clone/core-rule/Rule';
import Strategy from '../Strategy';

export class Priority extends Rule<[PlayerAction, Strategy], PriorityValue> {}

export default Priority;
