"use client";

/**
 * @file Plausible.tsx
 * Component for triggering Plausible events.
 */

import type { Maybe } from "@/interfaces";
import { useEffect } from "react";
import { usePlausible } from "next-plausible";

declare type Props = Record<string, Maybe<string> | undefined>;
declare type EventOptions = {
  props: Props;
  callback?(): void;
};
declare global {
  interface Window {
    plausible: ((...args: PlausibleEventArgs) => void) & {
      q: PlausibleEventArgs[];
    };
  }
}
export type PlausibleEventArgs = [string, EventOptions];
export interface IPlausibleProps {
  events?: PlausibleEventArgs[];
}

export const Plausible = ({ events }: IPlausibleProps) => {
  const plausible = usePlausible();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("Plausible Events:", events);
    }

    (events || []).forEach((args) => {
      plausible.apply(this, args);
    });
  }, [events, plausible.apply]);

  return null;
};
