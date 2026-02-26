"use client";

/**
 * @file AddAudioButton.tsx
 * Button component to add and remove audio from playlist queue.
 */

import { type MouseEventHandler, useContext, useEffect, useState } from "react";
import type { MediaItem } from "@/interfaces";
import type { PlayerAudio } from "@/components/Player/types";
import { PlayerContext } from "@/components/Player/contexts/PlayerContext";
import { parseAudioData } from "@/lib/parse/audio/parseAudioData";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ListMinusIcon, ListPlusIcon } from "lucide-react";

export type AddAudioButtonProps = React.ComponentProps<typeof Button> & {
  audio: MediaItem;
  fallbackProps?: Partial<PlayerAudio>;
};

export const AddAudioButton = ({
  className,
  onClick,
  audio,
  fallbackProps,
  ...rest
}: AddAudioButtonProps) => {
  const audioData = parseAudioData(audio, fallbackProps);
  const {
    state: playerState,
    addTrack,
    removeTrack,
  } = useContext(PlayerContext);
  const { tracks = [], currentTrackIndex } = playerState;
  const [isCurrentTrack, setIsCurrentTrack] = useState(false);
  const [isQueued, setIsQueued] = useState(false);
  const tooltipText = isQueued ? "Remove From Playlist" : "Add To Playlist";

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (audioData) {
      if (isQueued) {
        removeTrack(audioData);
      } else {
        addTrack(audioData);
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    const trackIndex = (tracks || []).findIndex(
      ({ id }) => id === audioData?.id,
    );

    if (trackIndex > -1) {
      setIsCurrentTrack(trackIndex === currentTrackIndex);
      setIsQueued(true);
    } else {
      setIsQueued(false);
    }
  }, [currentTrackIndex, tracks, audioData]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("rounded-full cursor-pointer", className)}
          size="icon"
          onClick={handleClick}
          disabled={!audioData}
          {...rest}
          data-queued={
            (isQueued && (isCurrentTrack ? "current" : true)) || undefined
          }
        >
          {!isQueued ? (
            <ListPlusIcon aria-label="Add to playlist" />
          ) : (
            <ListMinusIcon aria-label="ARemove from playlist" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
};
