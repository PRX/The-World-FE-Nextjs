"use client";

/**
 * @file DateTime.tsx
 * Component for rendering dates.
 */

import type { Maybe } from "@/interfaces";
import { sanitizeIso8601Date } from "@/lib/sanitize";
import { useEffect, useState } from "react";

export type DateTimeProps = {
  className?: string;
  date?: Maybe<Date | string | number>;
  timeZone?: string;
  locale?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
};

export const DateTime = ({
  className,
  date,
  timeZone,
  locale,
  options,
}: DateTimeProps) => {
  const [_isClient, setIsClient] = useState(false);
  const usedDateValue =
    typeof date === "string"
      ? sanitizeIso8601Date(date, timeZone || "America/New_York")
      : date;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!usedDateValue) return null;

  const renderDate =
    usedDateValue instanceof Date ? usedDateValue : new Date(usedDateValue);

  if (renderDate.toString() === "Invalid Date") return null;

  const formattedDate = renderDate.toLocaleDateString(locale || "en-US", {
    timeZone: timeZone || "America/New_York",
    ...options,
  });

  return (
    <time className={className} dateTime={`${renderDate.toISOString()}`}>
      {formattedDate}
    </time>
  );
};
