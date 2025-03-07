import { sanitizeIso8601Date } from './index';

describe('lib/sanitize', () => {
  describe('sanitizeIso8601Date', () => {
    test('should return dateString when format is not ISO 8601 compatible.', () => {
      const result = sanitizeIso8601Date('March 25, 1977');

      expect(result).toEqual('March 25, 1977');
    });

    test('should return null for supported falsey dateString values.', () => {
      const result1 = sanitizeIso8601Date('');
      const result2 = sanitizeIso8601Date(null);

      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });

    test('should add midnight time string to date only strings.', () => {
      const result = sanitizeIso8601Date('1977-03-25');

      expect(result?.startsWith('1977-03-25T00:00:00')).toBe(true);
    });

    test('should add local time-zone offset when not passed a timeZone parameter.', () => {
      const result = sanitizeIso8601Date('1977-03-25');
      const localTimeZone = new Date()
        .toLocaleTimeString('en-US', {
          timeZoneName: 'longOffset'
        })
        .match(/GMT(.+)/)?.[1];

      if (localTimeZone) expect(result?.endsWith(localTimeZone)).toBe(true);
    });

    test('should add time-zone offset for the passed time zone-string.', () => {
      const result = sanitizeIso8601Date('1977-03-25', 'America/New_York');

      expect(result?.endsWith('-05:00')).toBe(true);
    });

    test('should not add time-zone offset for the passed time-zone string when dateString has time-zone offset.', () => {
      const result = sanitizeIso8601Date(
        '1977-03-25T00:00:00+01:00',
        'America/New_York'
      );

      expect(result?.endsWith('+01:00')).toBe(true);
    });

    test('should support UTC dates.', () => {
      const result = sanitizeIso8601Date('1977-03-25T00:00:00Z');

      expect(result).toEqual('1977-03-25T00:00:00Z');
    });
  });
});
