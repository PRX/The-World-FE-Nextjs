/**
 * @file DateTime.tsx
 * Component for rendering dates.
 */

import { Maybe, RootState } from '@interfaces';
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

  const usedDateValue =
    typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? `${date}T00:00:00`
      : date;
  const renderDate =
    usedDateValue instanceof Date ? usedDateValue : new Date(usedDateValue);
  const formattedDate = renderDate.toLocaleDateString(locale || 'en-US', {
    ...(timeZone && { timeZone }),
    ...options
  });

  return (
    <time className={className} dateTime={`${usedDateValue}`}>
      {formattedDate}
    </time>
  );
};
