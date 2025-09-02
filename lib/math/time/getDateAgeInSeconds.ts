/**
 * Get number of seconds of a date from now.
 */

const getDateAgeInSeconds = (date: string | number | Date) =>
  Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

export default getDateAgeInSeconds;
