/**
 * @file Plausible.tsx
 * Component for triggering Plausible events.
 */

import { useEffect } from 'react';
import { usePlausible } from 'next-plausible';

declare type Props = Record<string, unknown> | never;
declare type EventOptions<P extends Props> = {
  props: P;
  callback?(): void;
};
export type PlausibleEventArgs = [string, EventOptions<any>];
export interface IPlausibleProps {
  events?: PlausibleEventArgs[];
  subject: {
    type?: string;
    id?: string | number;
  };
}

export const Plausible = ({
  events,
  subject: { type, id }
}: IPlausibleProps) => {
  const plausible = usePlausible();

  useEffect(() => {
    (window as any).plausible =
      (window as any).plausible ||
      function p(...rest: PlausibleEventArgs) {
        ((window as any).plausible.q = (window as any).plausible.q || []).push(
          rest
        );
      };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('Plausible Events:', events);
    }

    (events || []).forEach((args) => plausible.apply(this, args));
  }, [type, id]);

  return null;
};
