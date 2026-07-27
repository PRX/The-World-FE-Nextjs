"use client";

/**
 * @file PlayYoutubeButton.tsx
 * Play button component to add audio to playlist queue and toggle playing state of player.
 */

import { type MouseEventHandler, useContext, useEffect, useState } from "react";
import type { PlayerYoutube } from "@/components/Player/types";
import { PlayerContext } from "@/components/Player/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/util/css";
import { PauseIcon, PlayIcon } from "lucide-react";
import { parseYoutubeVideoData } from "@/lib/parse/video";

export type PlayYoutubeButtonProps = React.ComponentProps<typeof Button> & {
  video: GoogleAppsScript.YouTube.Schema.Video;
  fallbackProps?: Partial<PlayerYoutube>;
  disableTooltip?: boolean;
};

export const PlayYoutubeButton = ({
  className,
  onClick,
  video,
  fallbackProps,
  disableTooltip,
  ...rest
}: PlayYoutubeButtonProps) => {
  const videoData = parseYoutubeVideoData(video, fallbackProps);
  const {
    state: playerState,
    playTrack,
    togglePlayPause,
  } = useContext(PlayerContext);
  const { playing, currentTrackIndex = 0, tracks = [] } = playerState || {};
  const currentTrack = tracks[currentTrackIndex];
  const [audioIsPlaying, setAudioIsPlaying] = useState(
    playing && !!videoData && currentTrack?.id === videoData?.id,
  );
  const tooltipText = audioIsPlaying ? "Pause" : "Play";

  const handlePlayClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (videoData && videoData.id !== currentTrack?.id) {
      playTrack(videoData);
    } else {
      togglePlayPause();
    }

    if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    if (currentTrack?.id === videoData?.id) {
      setAudioIsPlaying(playing);
    } else {
      setAudioIsPlaying(false);
    }
  }, [playing, videoData, currentTrack]);

  const PlayButton = () => (
    <Button
      className={cn("rounded-full cursor-pointer", className)}
      size="icon"
      onClick={handlePlayClick}
      disabled={!videoData}
      {...rest}
      data-playing={audioIsPlaying || undefined}
    >
      {!audioIsPlaying ? (
        <PlayIcon aria-label="Play" />
      ) : (
        <PauseIcon aria-label="Pause" />
      )}
    </Button>
  );

  if (disableTooltip) return <PlayButton />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <PlayButton />
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
};
