"use client";

/**
 * @file ForwardButton.tsx
 * Button component to replay last 5 seconds of audio.
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
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { StepForwardIcon } from "lucide-react";

export type ForwardButtonProps = React.ComponentProps<typeof Button>;

export const ForwardButton = ({
  className,
  onClick,
  ...rest
}: ForwardButtonProps) => {
  const { state: playerState, forward } = useContext(PlayerContext);
  const { currentTrackIndex } = playerState;
  const hasCurrentTrack = !!currentTrackIndex || currentTrackIndex === 0;

  const handlePlayClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    forward();

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("rounded-full cursor-pointer", className)}
          size="icon"
          variant="ghost"
          onClick={handlePlayClick}
          disabled={!hasCurrentTrack}
          {...rest}
        >
          <StepForwardIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-x-2 z-(--z-ui-player)">
        Step Forward 30 Seconds{" "}
        <KbdGroup>
          <Kbd>L</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
};
