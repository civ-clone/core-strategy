import EntityRegistry, {
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import StrategyNote from './StrategyNote';
export interface IStrategyNoteRegistry<StrategyNote>
  extends IEntityRegistry<StrategyNote> {
  getByKey(key: string): StrategyNote[];
}
export declare class StrategyNoteRegistry
  extends EntityRegistry<StrategyNote>
  implements IStrategyNoteRegistry<StrategyNote>
{
  getByKey(key: string): StrategyNote[];
}
export default StrategyNoteRegistry;
