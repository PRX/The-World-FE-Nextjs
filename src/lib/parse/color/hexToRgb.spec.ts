import { hexToRgb, hexToCssRgba } from './index';

describe('lib/parse/color', () => {
  describe('hexToRgb', () => {
    test('should parse hex string to RGB values.', () => {
      const result = hexToRgb('#00FF00');

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(3);
      expect(result?.[0]).toEqual(0);
      expect(result?.[1]).toEqual(255);
      expect(result?.[2]).toEqual(0);
    });

    test('should parse hex without hash.', () => {
      const result = hexToRgb('00FF00');

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(3);
      expect(result?.[0]).toEqual(0);
      expect(result?.[1]).toEqual(255);
      expect(result?.[2]).toEqual(0);
    });

    test('should parse 3 character hex string to RGB values.', () => {
      const result = hexToRgb('#0F0');

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(3);
      expect(result?.[0]).toEqual(0);
      expect(result?.[1]).toEqual(255);
      expect(result?.[2]).toEqual(0);
    });
  });

  describe('hexToCssRgba', () => {
    test('should convert hex string to rgba.', () => {
      const result1 = hexToCssRgba('#00FF00', 0.5);
      const result2 = hexToCssRgba('#0F0', 0.25);

      expect(result1).toEqual('rgba(0,255,0,0.5)');
      expect(result2).toEqual('rgba(0,255,0,0.25)');
    });
  });
});
