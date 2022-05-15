import EntityRegistry, {
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import StrategyNote from './StrategyNote';

export interface IStrategyNoteRegistry<StrategyNote>
  extends IEntityRegistry<StrategyNote> {
  getByKey(key: string): StrategyNote[];
}

export class StrategyNoteRegistry
  extends EntityRegistry<StrategyNote>
  implements IStrategyNoteRegistry<StrategyNote>
{
  public getByKey(key: string): StrategyNote[] {
    return this.getBy('key', key);
  }
}

export default StrategyNoteRegistry;
