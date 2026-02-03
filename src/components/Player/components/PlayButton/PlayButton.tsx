"use client";

/**
 * @file PlayButton.tsx
 * Play button component to toggle playing state of player.
 */

import { type MouseEventHandler, useContext } from "react";
import { PlayerContext } from "@/components/Player/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

export type PlayButtonProps = React.ComponentProps<typeof Button>;

export const PlayButton = ({
  className,
  onClick,
  ...rest
}: PlayButtonProps) => {
  const { state: playerState, togglePlayPause } = useContext(PlayerContext);
  const { playing, currentTrackIndex } = playerState;
  const tooltipText = playing ? "Pause" : "Play";
  const hasCurrentTrack = !!currentTrackIndex || currentTrackIndex === 0;

  const handlePlayClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    togglePlayPause();

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "relative size-10 m-1 rounded-full cursor-pointer",
            "[&_svg]:size-7",
            "before:absolute before:-inset-1 before:-z-2 before:rounded-full before:bg-background",
            "after:absolute after:-inset-1 after:-z-1 after:rounded-full after:bg-[linear-gradient(180deg,#ffd295,#05968f_20%,#cc392f_40%,#ff9300_60%,#8cd2f4_80%,#984fa0)] after:opacity-0 after:transition-opacity",
            { "after:opacity-100": playing },
            className,
          )}
          size="icon-lg"
          onClick={handlePlayClick}
          disabled={!hasCurrentTrack}
          variant="action"
          {...rest}
          data-playing={playing || undefined}
        >
          {!playing ? <PlayIcon /> : <PauseIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-x-2 z-(--z-ui)">
        {tooltipText}{" "}
        <KbdGroup>
          <Kbd>Space</Kbd> or <Kbd>K</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
};
