/**
 * @file DateTime.tsx
 * Component for rendering dates.
 */

import { Maybe } from '@interfaces';

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
  if (!date) return null;

  const usedDateValue =
    typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? `${date}T00:00:00`
      : date;
  const renderDate =
    usedDateValue instanceof Date ? usedDateValue : new Date(usedDateValue);
  const formattedDate = renderDate.toLocaleDateString(
    locale || 'en-US',
    options
  );

  return (
    <time className={className} dateTime={`${usedDateValue}`}>
      {formattedDate}
    </time>
  );
};
