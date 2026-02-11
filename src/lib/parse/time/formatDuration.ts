/**
 * Format duration into a sting (hh:mm:ss).
 *
 * @param seconds number
 *    Duration in seconds.
 */
export const formatDuration = (seconds: number): string => {
  const pad = (v: number) => `0${v}`.slice(-2);
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
};
