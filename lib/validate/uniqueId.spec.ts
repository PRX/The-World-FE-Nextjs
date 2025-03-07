import { encode } from 'base-64';
import { validateUniqueId } from './uniqueId';

describe('lib/validate', () => {
  describe('uniqueId', () => {
    test('should return valid with unique id.', () => {
      const id = encode('post:1234');
      const result = validateUniqueId(id);

      expect(result).toBe(true);
    });

    test('should return invalid with invalid encoded id.', () => {
      const id = encode('not:correct:pattern:1234');
      const result = validateUniqueId(id);

      expect(result).toBe(false);
    });

    test('should return invalid with unencoded id.', () => {
      const id = 'bad-id';
      const result = validateUniqueId(id);

      expect(result).toBe(false);
    });
  });
});
