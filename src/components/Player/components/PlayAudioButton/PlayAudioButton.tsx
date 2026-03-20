"use client";

/**
 * @file PlayAudioButton.tsx
 * Play button component to add audio to playlist queue and toggle playing state of player.
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
import { cn } from "@/lib/util/css";
import { PauseIcon, PlayIcon } from "lucide-react";

export type PlayAudioButtonProps = React.ComponentProps<typeof Button> & {
  audio: MediaItem;
  fallbackProps?: Partial<PlayerAudio>;
};

export const PlayAudioButton = ({
  className,
  onClick,
  audio,
  fallbackProps,
  ...rest
}: PlayAudioButtonProps) => {
  const audioData = parseAudioData(audio, fallbackProps);
  const {
    state: playerState,
    playAudio,
    togglePlayPause,
  } = useContext(PlayerContext);
  const { playing, currentTrackIndex = 0, tracks = [] } = playerState;
  const currentTrack = tracks[currentTrackIndex];
  const [audioIsPlaying, setAudioIsPlaying] = useState(
    playing && !!audioData && currentTrack?.id === audioData?.id,
  );
  const tooltipText = audioIsPlaying ? "Pause" : "Play";

  const handlePlayClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (audioData && audioData.id !== currentTrack?.id) {
      playAudio(audioData);
    } else {
      togglePlayPause();
    }

    if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    if (currentTrack?.id === audioData?.id) {
      setAudioIsPlaying(playing);
    } else {
      setAudioIsPlaying(false);
    }
  }, [playing, audioData, currentTrack]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("rounded-full cursor-pointer", className)}
          size="icon"
          onClick={handlePlayClick}
          disabled={!audioData}
          {...rest}
          data-playing={audioIsPlaying || undefined}
        >
          {!audioIsPlaying ? (
            <PlayIcon aria-label="Play" />
          ) : (
            <PauseIcon aria-label="Pause" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
};
