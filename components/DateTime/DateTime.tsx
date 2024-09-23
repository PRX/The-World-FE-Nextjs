/**
 * @file DateTime.tsx
 * Component for rendering dates.
 */

import type { Maybe, RootState } from '@interfaces';
import { sanitizeIso8601Date } from '@lib/sanitize';
import { getSettingsTimeZone } from '@store/reducers';
import { useStore } from 'react-redux';

export type DateTimeProps = {
  className?: string;
  date?: Maybe<Date | string | number>;
  locale?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
};

export const DateTime = ({
  className,
  date,
  locale,
  options
}: DateTimeProps) => {
  const store = useStore<RootState>();
  const state = store.getState();
  const timeZone = getSettingsTimeZone(state);

  const usedDateValue =
    typeof date === 'string'
      ? sanitizeIso8601Date(date, timeZone || undefined)
      : date;

  if (!usedDateValue) return null;

  const renderDate =
    usedDateValue instanceof Date ? usedDateValue : new Date(usedDateValue);

  if (renderDate.toString() === 'Invalid Date') return null;

  const formattedDate = renderDate.toLocaleDateString(locale || 'en-US', {
    ...(timeZone && { timeZone }),
    ...options
  });

  return (
    <time className={className} dateTime={`${renderDate.toISOString()}`}>
      {formattedDate}
    </time>
  );
};
