/**
 * @file uniqueId.ts
 * Helper functions to validate API resource unique ids.
 */

import { decode } from 'base-64';

/**
 * Check if string is a unique id.
 *
 * @param id Unique id to validate.
 */
export const validateUniqueId = (id: string) => {
  // Empty value is not a unique id.
  if (!id?.trim()) return false;

  try {
    const parsedId = decode(id);

    // Return if the decoded string matches expected pattern.
    return /^[\w-]+:\d+$/.test(parsedId);
  } catch (e) {
    // String could not be decoded, so is not a unique id.
    return false;
  }
};
