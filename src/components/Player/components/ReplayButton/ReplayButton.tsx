"use client";

/**
 * @file ReplayButton.tsx
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
import { StepBackIcon } from "lucide-react";

export type ReplayButtonProps = React.ComponentProps<typeof Button>;

export const ReplayButton = ({
  className,
  onClick,
  ...rest
}: ReplayButtonProps) => {
  const { state: playerState, replay } = useContext(PlayerContext);
  const { currentTrackIndex } = playerState;
  const hasCurrentTrack = !!currentTrackIndex || currentTrackIndex === 0;

  const handlePlayClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    replay();

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
          <StepBackIcon aria-label="Step back five seconds" />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-x-2 z-(--z-ui-player)">
        Step Back 5 Seconds{" "}
        <KbdGroup>
          <Kbd>J</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
};
