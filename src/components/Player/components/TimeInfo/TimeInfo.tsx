"use client";

/**
 * @file TimeInfo.tsx
 * Playback time info text.
 */

import type React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { convertSecondsToDuration } from "@/lib/parse/time";
import { PlayerContext } from "@/components/Player";
import { cn } from "@/lib/util/css";

export type TimeInfoProps = React.ComponentProps<"div">;

export const TimeInfo: React.FC<TimeInfoProps> = ({
  className,
  ...other
}: TimeInfoProps) => {
  const { audioElm, state: playerState } = useContext(PlayerContext);
  const { currentTrackIndex = 0, tracks } = playerState || {};
  const currentTrack = tracks?.[currentTrackIndex];
  const { duration: audioDuration } = currentTrack || {};
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audioDuration || 0);
  const playedDuration = convertSecondsToDuration(currentTime);
  const trackDuration = convertSecondsToDuration(duration);
  const timeInfo = `${playedDuration} / ${trackDuration}`;

  /**
   * Update player progress visuals.
   */
  const updateProgress = useCallback(
    (seconds?: number) => {
      const { currentTime: ct, duration: d } = audioElm || {};
      const updatedPlayed = seconds || seconds === 0 ? seconds : ct;

      setCurrentTime(updatedPlayed || 0);
      setDuration(d || audioDuration || 0);
    },
    [audioElm, audioDuration],
  );

  /**
   * Update state when audio metadata is loaded.
   */
  const handleLoadedMetadata = useCallback(() => {
    updateProgress();
  }, [updateProgress]);

  /**
   * Updated state on interval tick.
   */
  const handleUpdate = useCallback(() => {
    updateProgress();
  }, [updateProgress]);

  /**
   * Setup audio element event handlers.
   */
  useEffect(() => {
    audioElm?.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElm?.addEventListener("timeupdate", handleUpdate);

    return () => {
      audioElm?.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElm?.removeEventListener("timeupdate", handleUpdate);
    };
  }, [audioElm, handleLoadedMetadata, handleUpdate]);

  return (
    <div
      {...other}
      className={cn(
        "flex place-items-center font-mono-sans whitespace-nowrap",
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        {duration ? (
          <motion.div
            key={currentTrack?.id || "empty"}
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
            {timeInfo}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
