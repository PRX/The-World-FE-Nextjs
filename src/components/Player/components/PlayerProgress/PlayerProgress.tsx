"use client";

/**
 * @file PlayerProgress.tsx
 * Play progress bar control.
 */

import type React from "react";
import {
  type CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { convertSecondsToDuration } from "@/lib/parse/time";
import { PlayerContext } from "../../contexts";
import {
  PlayerActionTypes,
  playerProgressInitialState,
  playerProgressStateReducer,
} from "../../state";
import { cn } from "@/lib/util/css";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type PlayerProgressProps = React.ComponentProps<"div"> & {
  onScrub?(scrubPosition: number): void;
  updateFrequency?: number;
};

export const PlayerProgress: React.FC<PlayerProgressProps> = ({
  className,
  onScrub,
  updateFrequency = 500,
  ...rest
}: PlayerProgressProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const updateInterval = useRef<ReturnType<typeof setInterval>>(null);
  const { audioElm, state: playerState, seekTo } = useContext(PlayerContext);
  const [loaded, setLoaded] = useState(0);
  const [state, dispatch] = useReducer(
    playerProgressStateReducer,
    playerProgressInitialState,
  );
  const { scrubPosition, played } = state;
  const { currentTrackIndex = 0, tracks, standalone } = playerState || {};
  const currentTrack = tracks?.[currentTrackIndex];
  const { duration: trackDuration } = currentTrack || {};
  const totalDurationSeconds = audioElm?.duration || trackDuration || 0;
  const progress = scrubPosition || (played !== Infinity && played) || 0;
  const progressDuration = convertSecondsToDuration(
    Math.round(totalDurationSeconds * progress),
  );

  /**
   * Update scrub position on the progress track.
   * @param position Ratio of pointer horizontal location relative to
   * progress track.
   */
  const updateScrubPosition = useCallback(
    (e: PointerEvent) => {
      if (!trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const position = Math.max(0, Math.min(e.offsetX / rect.width, 1));

      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_SCRUB_POSITION,
        payload: position,
      });

      if (onScrub) onScrub(position);
    },
    [onScrub],
  );

  /**
   * Update player progress visuals.
   */
  const updateProgress = useCallback(
    (seconds?: number) => {
      const { currentTime: ct = 0, duration: d } = audioElm || {};
      const updatedPlayed = seconds || seconds === 0 ? seconds : ct;

      dispatch({
        type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS,
        payload: {
          played: updatedPlayed / (d || totalDurationSeconds),
        },
      });
    },
    [audioElm, totalDurationSeconds],
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
   * Handle pointer move event on progress track.
   * @param e Pointer Event
   */
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      updateScrubPosition(e);
    },
    [updateScrubPosition],
  );

  /**
   * Handle pointer down event on progress track.
   * @param e Pointer Event
   */
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!trackRef.current) return;

      trackRef.current.addEventListener("pointermove", handlePointerMove);
      trackRef.current.setPointerCapture(e.pointerId);
      trackRef.current.dataset.scrubbing = "scrubbing";

      updateScrubPosition(e);
    },
    [handlePointerMove, updateScrubPosition],
  );

  /**
   * Handle pointer up event on progress track.
   * @param e Pointer Event
   */
  const handlePointerUp = useCallback(() => {
    const newTime = (scrubPosition || played) * totalDurationSeconds;

    seekTo(newTime);

    dispatch({
      type: PlayerActionTypes.PLAYER_UPDATE_PROGRESS_TO_SCRUB_POSITION,
    });

    if (trackRef.current) {
      trackRef.current.removeEventListener("pointermove", handlePointerMove);
      delete trackRef.current.dataset.scrubbing;
    }
  }, [totalDurationSeconds, handlePointerMove, scrubPosition, seekTo, played]);

  /**
   * Interval handler to update loaded progress.
   */
  const handleUpdateLoaded = useCallback(() => {
    if (!audioElm) return;

    const { buffered } = audioElm;
    const newLoaded = buffered.length ? buffered.end(0) / audioElm.duration : 0;

    setLoaded(newLoaded);

    if (newLoaded >= 1 && updateInterval.current) {
      clearInterval(updateInterval.current);
    }
  }, [audioElm]);

  useEffect(() => {
    if (standalone) return;

    const playerStateJson = localStorage?.getItem("playerProgressState");

    if (playerStateJson) {
      dispatch({
        type: PlayerActionTypes.PLAYER_HYDRATE,
        payload: JSON.parse(playerStateJson),
      });
    }
  }, [standalone]);

  useEffect(() => {
    if (!standalone && localStorage) {
      localStorage.setItem("playerProgressState", JSON.stringify(state));
    }
  }, [state, standalone]);

  /**
   * Setup update interval.
   */
  useEffect(() => {
    if (updateInterval.current) clearInterval(updateInterval.current);

    updateInterval.current = setInterval(handleUpdateLoaded, updateFrequency);

    return () => {
      if (updateInterval.current) clearInterval(updateInterval.current);
    };
  }, [updateFrequency, handleUpdateLoaded]);

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

  /**
   * Setup progress track event handlers.
   */
  useEffect(() => {
    const refElm = trackRef.current;
    refElm?.addEventListener("pointerdown", handlePointerDown);
    refElm?.addEventListener("pointerup", handlePointerUp);

    return () => {
      refElm?.removeEventListener("pointerdown", handlePointerDown);
      refElm?.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerDown, handlePointerUp]);

  return (
    <div
      className={cn(
        "group/playerProgress relative grid grid-cols-[calc(var(--progress)-4px)_4px_1fr] grid-rows-[4px] h-1 bg-navy-blue/60 cursor-pointer",
        "before:absolute before:inset-0 before:right-auto before:w-(--loaded) before:bg-purple",
        "after:col-start-1 after:row-start-1 after:z-1 after:bg-linear-to-r after:from-red after:to-orange",
        className,
      )}
      {...rest}
      style={
        {
          "--progress": `${progress * 100}%`,
          "--loaded": `${loaded * 100}%`,
        } as CSSProperties
      }
      ref={trackRef}
    >
      <Tooltip open={!!scrubPosition}>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "relative col-start-2 row-start-1 z-2 bg-orange rounded-r-full",
              "before:absolute before:inset-0 before:bg-orange before:rounded-full before:transition-transform",
              "group-hover/playerProgress:before:scale-300",
              "group-data-scrubbing/playerProgress:before:scale-300",
            )}
            data-text={progressDuration}
          />
        </TooltipTrigger>
        <TooltipContent>{progressDuration}</TooltipContent>
      </Tooltip>
    </div>
  );
};
