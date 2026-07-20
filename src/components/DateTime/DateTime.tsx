"use client";

/**
 * @file DateTime.tsx
 * Component for rendering dates.
 */

import type { Maybe } from "@/interfaces";
import "temporal-polyfill/global";
import { sanitizeIso8601Date } from "@/lib/sanitize";
import { useEffect, useState } from "react";

export type DateTimeProps = {
  className?: string;
  date?: Maybe<Temporal.PlainDate | Temporal.PlainDateTime | string>;
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

  const renderDate = ((v) => {
    try {
      return Temporal.PlainDateTime.from(v);
    } catch (_e) {
      return null;
    }
  })(usedDateValue);

  if (!renderDate) return null;

  const formattedDate = renderDate.toLocaleString(locale || "en-US", {
    timeZone: timeZone || "America/New_York",
    ...options,
  });

  return (
    <time className={className} dateTime={`${renderDate.toString()}`}>
      {formattedDate}
    </time>
  );
};
