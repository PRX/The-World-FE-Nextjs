/**
 * @file sanitizeIso8601Date.ts
 * Sanitize an ISO 8601 date string to have a time and timezone.
 */

import type { Maybe } from "@/interfaces";

export const sanitizeIso8601Date = (
  dateString: Maybe<string>,
  timeZone?: Maybe<string>,
) => {
  if (!dateString) return null;
  if (!/^\d{4}-\d{2}-\d{2}/.test(dateString)) return dateString as string;

  let usedDateValue = dateString;

  // Date strings from the API should be in ISO 8601, but could be missing some elements.
  if (
    typeof usedDateValue === "string" &&
    /^\d{4}-\d{2}-\d{2}/.test(usedDateValue)
  ) {
    // Ensure times are denoted with`T` instead of a space.
    usedDateValue = usedDateValue.replace(
      /\s(\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?)/,
      "T$1",
    );

    // Ensure ISO 8601 dates have a time. Use noon instead of midnight to avoid issues with Daylight Savings Time.
    if (!/T\d{2}:\d{2}:\d{2}/.test(usedDateValue)) {
      usedDateValue = `${usedDateValue}T12:00:00`;
    }

    // Ensure ISO 8601 dates are set to settings time-zone if they do not already have a time-zone offset.
    if (!/([+-]\d{2}:?\d{2}|Z)$/.test(usedDateValue)) {
      // Time-zone from settings will be in long format, eg `America/New_York`.
      // We need to convert that to a offset string.
      const tz = new Date()
        .toLocaleTimeString("en-US", {
          ...(timeZone && { timeZone }),
          timeZoneName: "longOffset",
        })
        .match(/GMT(.+)/)?.[1];

      usedDateValue = `${usedDateValue}${tz}`;
    }
  }

  // Make sure date values that are UTC midnight get time set to noon.
  // Prevents day rollbacks when rendering date on client.
  if (/T00:00:00\+00:00$/.test(usedDateValue)) {
    usedDateValue = usedDateValue.replace(
      /T00:00:00\+00:00$/,
      "T12:00:00+00:00",
    );
  }

  return usedDateValue;
};
