import StrategyNote from '../StrategyNote';
import StrategyNoteRegistry from '../StrategyNoteRegistry';
import { expect } from 'chai';

describe('StrategyNoteRegistry', () => {
  it('should find a registered note by its key', () => {
    const registry = new StrategyNoteRegistry(),
      noteA = new StrategyNote('a', 1),
      noteB = new StrategyNote('b', 2);

    registry.register(noteA, noteB);

    expect(registry.getByKey('a')).equal(noteA);
    expect(registry.getByKey('b')).equal(noteB);
    expect(registry.getByKey('c')).undefined;
  });

  it('should reject a second note with the same key', () => {
    const registry = new StrategyNoteRegistry(),
      note = new StrategyNote('a', 1);

    registry.register(note);

    expect(() => registry.register(new StrategyNote('a', 2))).throw(
      TypeError,
      "Entity with key 'a' already exists."
    );
    expect(registry.getByKey('a')).equal(note);
    expect(registry.length).equal(1);
  });

  it('should not find a note once it is unregistered', () => {
    const registry = new StrategyNoteRegistry(),
      note = new StrategyNote('a', 1);

    registry.register(note);
    registry.unregister(note);

    expect(registry.getByKey('a')).undefined;

    const replacement = new StrategyNote('a', 2);

    registry.register(replacement);

    expect(registry.getByKey('a')).equal(replacement);
  });

  it('should `replace` an existing note with the same key, or add a new one', () => {
    const registry = new StrategyNoteRegistry(),
      original = new StrategyNote('a', 1),
      replacement = new StrategyNote('a', 2),
      other = new StrategyNote('b', 3);

    registry.register(original);
    registry.replace(replacement, other);

    expect(registry.getByKey('a')).equal(replacement);
    expect(registry.getByKey('b')).equal(other);
    expect(registry.includes(original)).false;
    expect(registry.entries()).eql([replacement, other]);
  });

  it('should `getOrCreateByKey` without creating a duplicate', () => {
    const registry = new StrategyNoteRegistry(),
      created = registry.getOrCreateByKey('a', 1);

    expect(created.value()).equal(1);
    expect(registry.getOrCreateByKey('a', 2)).equal(created);
    expect(registry.length).equal(1);
  });

  it('should find a note restored the way `core-save-game` hydrates one', () => {
    // `hydrate` allocates with `Object.create` (no constructor), fills the fields with `Object.assign`, and only then
    // registers the entity into the game's registry.
    const registry = new StrategyNoteRegistry(),
      restored = Object.create(StrategyNote.prototype) as StrategyNote<number>;

    Object.assign(restored, {
      _id: 'StrategyNote-1',
      _key: 'a',
      _keys: ['key', 'value'],
      _value: 1,
    });

    registry.register(restored);

    expect(registry.getByKey('a')).equal(restored);
    expect(() => registry.register(new StrategyNote('a', 2))).throw(TypeError);
  });
});
