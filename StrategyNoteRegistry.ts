import EntityRegistry, {
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import StrategyNote from './StrategyNote';

export interface IStrategyNoteRegistry extends IEntityRegistry<StrategyNote> {
  getByKey<Value = any>(key: string): StrategyNote<Value> | undefined;
  getOrCreateByKey<Value>(key: string, value: Value): StrategyNote<Value>;
}

export class StrategyNoteRegistry
  extends EntityRegistry<StrategyNote>
  implements IStrategyNoteRegistry
{
  getByKey<Value = any>(key: string): StrategyNote<Value> | undefined {
    return this.getBy('key', key)[0];
  }

  getOrCreateByKey<Value>(key: string, value: Value): StrategyNote<Value> {
    const existing = this.getByKey(key);

    if (existing) {
      return existing;
    }

    const note = new StrategyNote<Value>(key, value);

    this.register(note);

    return note;
  }

  register(...entities: StrategyNote[]) {
    entities.forEach((entity) => {
      if (this.getByKey(entity.key())) {
        throw new TypeError(
          `Entity with key '${entity.key()}' already exists.`
        );
      }
    });
  }
}

export const instance: StrategyNoteRegistry = new StrategyNoteRegistry();

export default StrategyNoteRegistry;
