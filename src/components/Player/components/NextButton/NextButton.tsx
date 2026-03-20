"use client";

/**
 * @file NextButton.tsx
 * Button component to skip to next track in playlist queue.
 */

import { type MouseEventHandler, useContext } from "react";
import { PlayerContext } from "@/components/Player/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/util/css";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SkipForwardIcon } from "lucide-react";

export type NextButtonProps = React.ComponentProps<typeof Button>;

export const NextButton = ({
  className,
  onClick,
  ...rest
}: NextButtonProps) => {
  const { state: playerState, nextTrack } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = playerState;
  const hasMultipleTracks = !!tracks && tracks?.length > 1;
  const hasCurrentTrack = !!currentTrackIndex || currentTrackIndex === 0;
  const hasNextTrack = hasCurrentTrack && !!tracks?.[currentTrackIndex + 1];

  const handlePlayClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    nextTrack();

    if (onClick) {
      onClick(e);
    }
  };

  return (
    hasMultipleTracks && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn("rounded-full cursor-pointer", className)}
            size="icon"
            variant="ghost"
            onClick={handlePlayClick}
            disabled={!hasNextTrack}
            {...rest}
          >
            <SkipForwardIcon aria-label="Next" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-x-2 z-(--z-ui-player)">
          Next{" "}
          <KbdGroup>
            <Kbd>]</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
    )
  );
};
