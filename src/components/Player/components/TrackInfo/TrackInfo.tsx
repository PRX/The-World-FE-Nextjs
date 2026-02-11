"use client";

/**
 * @file TrackInfo.tsx
 * Component to display info about the current track.
 */

import type React from "react";
import { forwardRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sanitizeIso8601Date } from "@/lib/sanitize";
import { DateTime } from "@/components/DateTime";
import { Marquee } from "@/components/Marquee";
import { PlayerContext } from "@/components/Player";
import Link from "next/link";
import { generateContentLinkHref } from "@/lib/routing";
import { cn } from "@/lib/utils";

export type TrackInfoProps = React.ComponentProps<"div"> & {
  linkProps?: Partial<React.ComponentProps<typeof Link>>;
};

export const TrackInfo = forwardRef<HTMLDivElement, TrackInfoProps>(
  ({ className, linkProps }: TrackInfoProps, ref) => {
    const { state } = useContext(PlayerContext);
    const { tracks = [], currentTrackIndex = 0 } = state;
    const currentTrack = tracks[currentTrackIndex];
    const { title, info, linkResource } = currentTrack || {};
    const linkResourceHref =
      linkResource?.link && generateContentLinkHref(linkResource.link);

    return (
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          ref={ref}
          className={cn("relative grid gap-y-1", className)}
          key={currentTrack ? currentTrack.id : "empty"}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <Marquee className="text-md">
            <span className=" font-bold">{title}</span>
          </Marquee>
          {info?.length ? (
            <Marquee className="text-sm">
              <span className="[&>*+*]:before:content-['\2022'] [&>*+*]:before:mx-1">
                {info
                  .filter((t) => !!t)
                  .map((value) => {
                    const dateValue =
                      value instanceof Date
                        ? value
                        : new Date(sanitizeIso8601Date(value) || "");
                    const isDateValue =
                      value instanceof Date ||
                      !Number.isNaN(dateValue.getTime());

                    return isDateValue ? (
                      <DateTime
                        className=""
                        date={dateValue}
                        options={{
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }}
                        key={`${dateValue.toString()}`}
                      />
                    ) : (
                      <span className="" key={value}>
                        {value}
                      </span>
                    );
                  })}
              </span>
            </Marquee>
          ) : null}
          {linkResourceHref && (
            <Link
              href={linkResourceHref}
              className={cn(
                "absolute -inset-1 rounded-sm outline-none",
                "hover:bg-current/10",
                "focus-visible:ring-ring/50 focus-visible:ring-4",
              )}
              aria-label={`Read "${title}"`}
              {...linkProps}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  },
);
