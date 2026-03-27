"use client";

/**
 * @file PreviousButton.tsx
 * Button component to skip to previous track in playlist queue.
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
import { SkipBackIcon } from "lucide-react";

export type PreviousButtonProps = React.ComponentProps<typeof Button>;

export const PreviousButton = ({
  className,
  onClick,
  ...rest
}: PreviousButtonProps) => {
  const { state: playerState, previousTrack } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = playerState || {};
  const hasMultipleTracks = !!tracks && tracks?.length > 1;
  const hasCurrentTrack = !!currentTrackIndex || currentTrackIndex === 0;
  const hasPreviousTrack = hasCurrentTrack && !!tracks?.[currentTrackIndex - 1];

  const handlePlayClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    previousTrack();

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
            disabled={!hasPreviousTrack}
            {...rest}
          >
            <SkipBackIcon aria-label="Previous" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-x-2 z-(--z-ui-player)">
          Previous{" "}
          <KbdGroup>
            <Kbd>[</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
    )
  );
};
