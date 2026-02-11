import { convertStringToInteger } from "@/lib/convert/string";

/**
 * Convert duration string value into integer array, then reverse it so parts
 * are in ascending order, eg. [seconds, minutes [, hours, ...]].
 *
 * @param duration String to convert in format `[HH:]MM:SS`.
 * @returns Returns number array, with parts reversed.
 */
export const convertDurationStringToIntegerArray = (duration: string) =>
  duration
    // Split sting on colons to get duration parts.
    ?.split(":")
    // Parse each part into integers.
    .map((v) => convertStringToInteger(v))
    // Reverse order of parts. ie. [seconds, minutes [, hours]].
    .reverse() || [0]; // Return zero seconds when passed duration is undefined.
