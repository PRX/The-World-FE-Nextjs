import getDateAgeInSeconds from './getDateAgeInSeconds';

describe('lib/math/time', () => {
  describe('getDateAgeInSeconds', () => {
    test('should return age in seconds', () => {
      const date = new Date();

      date.setSeconds(date.getSeconds() - 10);

      const result1 = getDateAgeInSeconds(date);
      const result2 = getDateAgeInSeconds(date.getTime());
      const result3 = getDateAgeInSeconds(date.toString());

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(result3).toBe(10);
    });
  });
});
