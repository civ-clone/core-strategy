import DataObject from '@civ-clone/core-data-object/DataObject';
import StrategyNote, { generateKey } from '../StrategyNote';
import { expect } from 'chai';

class Item extends DataObject {}

describe('StrategyNote', () => {
  it('should hold its key and value', () => {
    const note = new StrategyNote('key', { a: 1 });

    expect(note.key()).equal('key');
    expect(note.value()).eql({ a: 1 });
  });

  describe('generateKey', () => {
    it('should use the `id` of a `DataObject`', () => {
      const item = new Item();

      expect(generateKey(item)).equal(item.id());
    });

    it('should use a string as it is', () =>
      expect(generateKey('a', 'b')).equal('a-b'));

    it('should use the `id()` of an item that is not a `DataObject`', () =>
      expect(generateKey({ id: () => 'not-a-data-object' }, 'x')).equal(
        'not-a-data-object-x'
      ));

    it('should fall back to `toString()` for anything else', () =>
      expect(
        generateKey({ toString: () => 'as-string' } as unknown as string)
      ).equal('as-string'));

    it('should join mixed items in order', () => {
      const item = new Item();

      expect(generateKey('prefix', item, { id: () => 'other' })).equal(
        `prefix-${item.id()}-other`
      );
    });
  });
});
