import {
  EntityRegistry,
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import StrategyNote from './StrategyNote';
export interface IStrategyNoteRegistry extends IEntityRegistry<StrategyNote> {
  getByKey<Value = any>(key: string): StrategyNote<Value> | undefined;
  getOrCreateByKey<Value>(key: string, value: Value): StrategyNote<Value>;
  replace(...entities: StrategyNote[]): void;
}
export declare class StrategyNoteRegistry
  extends EntityRegistry<StrategyNote>
  implements IStrategyNoteRegistry
{
  constructor();
  getByKey<Value = any>(key: string): StrategyNote<Value> | undefined;
  getOrCreateByKey<Value>(key: string, value: Value): StrategyNote<Value>;
  register(...entities: StrategyNote[]): void;
  replace(...entities: StrategyNote[]): void;
}
export declare const instance: StrategyNoteRegistry;
export default StrategyNoteRegistry;
