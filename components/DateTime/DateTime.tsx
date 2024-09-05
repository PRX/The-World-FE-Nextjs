/**
 * @file DateTime.tsx
 * Component for rendering dates.
 */

import type { Maybe, RootState } from '@interfaces';
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

  if (!date) return null;

  let usedDateValue = date;

  // Date strings from the API should be in ISO 8601, but could be missing some elements.
  if (
    typeof usedDateValue === 'string' &&
    /^\d{4}-\d{2}-\d{2}/.test(usedDateValue)
  ) {
    // Ensure ISO 8601 dates have a time.
    if (!/T\d{2}:\d{2}:\d{2}/.test(usedDateValue)) {
      usedDateValue = `${usedDateValue}T00:00:00`;
    }

    // Ensure ISO 8601 dates are set to settings time-zone if they do not already have a time-zone offset.
    if (!/[+-]\d{2}:?\d{2}$/.test(usedDateValue)) {
      // Time-zone from settings will be in long format, eg `America/New_York`.
      // We need to convert that to a offset string.
      const tz = new Date()
        .toLocaleTimeString('en-US', {
          ...(timeZone && { timeZone }),
          timeZoneName: 'longOffset'
        })
        .match(/GMT(.+)/)?.[1];

      usedDateValue = `${usedDateValue}${tz}`;
    }
  }

  const renderDate =
    usedDateValue instanceof Date ? usedDateValue : new Date(usedDateValue);
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
