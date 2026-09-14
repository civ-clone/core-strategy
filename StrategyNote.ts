import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';

export interface IStrategyNote<Value = any> {
  key(): string;
  value(): Value;
}

/**
 * A named piece of working memory, and now an entity.
 *
 * It was a plain class implementing `IStrategyNote`, which was enough while
 * nothing needed to outlive the process: `EntityRegistry<T = any>` has no
 * `DataObject` constraint, so a registry accepted it happily. Saving is what
 * changed that. `core-save-game` discovers entities by walking `DataObject`s,
 * so a note was invisible to a save — `strategyNotes` was dispositioned as
 * runtime state and still wrote nothing at all.
 *
 * Two things were losing data because of it:
 *
 * - **`GoTo`.** Its `Busy` criterion is `unit.tile() === path.end()`, and the
 *   path it compares against is held in one of these. With nothing saved there
 *   was nothing to rebuild the criterion from, so a unit saved mid-journey
 *   could not be restored at all.
 * - **The AI.** Anything it wants to remember across a turn goes here, so
 *   anything it wants to remember across a *save* has to be an entity.
 *
 * `value` is deliberately still `Value = any`, but not *anything*: it has to be
 * a shape `encode` can write and `hydrate` can give back unchanged. An entity
 * becomes a `$ref` and comes back as the restored instance; a scalar, a plain
 * object, an array, a `Map` and a `Set` all survive.
 *
 * What does **not** survive is a class wrapped around a collection. `encode`
 * writes a registry held as a field as an array of its encoded members and
 * cannot record which class that array was, so a note holding one restores as
 * a plain array. `base-unit-action-goto` hit this first — it stored a `Path`,
 * which is an `EntityRegistry` of `Tile`s — and the fix was to store the tiles
 * themselves rather than to teach the format about classes-around-collections.
 * Prefer entities, scalars and arrays of them for anything a note must keep.
 */
export class StrategyNote<Value = any>
  extends DataObject
  implements IStrategyNote<Value>
{
  private _key: string;
  private _value: Value;

  constructor(key: string, value: Value) {
    super();

    this._key = key;
    this._value = value;

    this.addKey('key', 'value');
  }

  public key(): string {
    return this._key;
  }

  public value(): Value {
    return this._value;
  }
}

export const generateKey: (
  ...items: (Pick<IDataObject, 'id'> | string)[]
) => string = (...items: (Pick<IDataObject, 'id'> | string)[]) =>
  items
    .map((item) =>
      item instanceof DataObject
        ? item.id()
        : typeof item === 'string'
        ? item
        : item.toString()
    )
    .join('-');

export default StrategyNote;
