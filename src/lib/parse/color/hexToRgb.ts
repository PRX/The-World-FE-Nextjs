/**
 * @file hexToRgb.ts
 */

export type RgbValues = number[];

/**
 * Helper to convert hex string into array of number values.
 *
 * @param hex
 *    Hexadecimal color string.
 */
export const hexToRgb = (hex: string) =>
  hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_m: string, r: string, g: string, b: string) =>
        `#${r}${r}${g}${g}${b}${b}`
    )
    .replace(/^#/, '')
    .match(/.{2}/g)
    ?.map((x: string) => parseInt(x, 16));

/**
 * Convert hexadecimal colors strings to rgba.
 *
 * @param hex
 *    Hexadecimal color string.
 * @param alpha
 *    Number between 0 and 1.
 */
export const hexToCssRgba = (hex: string, alpha: number) =>
  `rgba(${hexToRgb(hex)},${alpha})`;
