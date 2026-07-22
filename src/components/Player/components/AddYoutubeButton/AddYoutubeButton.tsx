"use client";

/**
 * @file AddYoutubeButton.tsx
 * Button component to add and remove YouTube track from playlist queue.
 */

import { type MouseEventHandler, useContext, useEffect, useState } from "react";
import type { PlayerYoutube } from "@/components/Player/types";
import { parseYoutubeVideoData } from "@/lib/parse/video";
import { PlayerContext } from "@/components/Player/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/util/css";
import { ListMinusIcon, ListPlusIcon } from "lucide-react";

export type AddYoutubeButtonProps = React.ComponentProps<typeof Button> & {
  video: GoogleAppsScript.YouTube.Schema.Video;
  fallbackProps?: Partial<PlayerYoutube>;
};

export const AddYoutubeButton = ({
  className,
  onClick,
  video,
  fallbackProps,
  ...rest
}: AddYoutubeButtonProps) => {
  const videoData = parseYoutubeVideoData(video, fallbackProps);
  const {
    state: playerState,
    addTrack,
    removeTrack,
  } = useContext(PlayerContext);
  const { tracks = [], currentTrackIndex } = playerState || {};
  const [isCurrentTrack, setIsCurrentTrack] = useState(false);
  const [isQueued, setIsQueued] = useState(false);
  const tooltipText = isQueued ? "Remove From Playlist" : "Add To Playlist";

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (videoData) {
      if (isQueued) {
        removeTrack(videoData);
      } else {
        addTrack(videoData);
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    const trackIndex = (tracks || []).findIndex(
      ({ id }) => id === videoData?.id,
    );

    if (trackIndex > -1) {
      setIsCurrentTrack(trackIndex === currentTrackIndex);
      setIsQueued(true);
    } else {
      setIsQueued(false);
    }
  }, [currentTrackIndex, tracks, videoData]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("rounded-full cursor-pointer", className)}
          size="icon"
          onClick={handleClick}
          disabled={!videoData}
          {...rest}
          data-queued={
            (isQueued && (isCurrentTrack ? "current" : true)) || undefined
          }
        >
          {!isQueued ? (
            <ListPlusIcon aria-label="Add to playlist" />
          ) : (
            <ListMinusIcon aria-label="Remove from playlist" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
};
