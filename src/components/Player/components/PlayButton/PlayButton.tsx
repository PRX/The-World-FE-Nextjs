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

export type PlayButtonProps = React.ComponentProps<typeof Button> & {
  disableTooltip?: boolean;
};

export const PlayButton = ({
  className,
  onClick,
  disableTooltip,
  ...rest
}: PlayButtonProps) => {
  const { state: playerState, togglePlayPause } = useContext(PlayerContext);
  const { playing } = playerState;
  const tooltipText = playing ? "Pause" : "Play";

  const handlePlayClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    togglePlayPause();

    if (onClick) {
      onClick(e);
    }
  };

  const renderButton = () => (
    <Button
      className={cn(
        "relative size-10 m-1 rounded-full cursor-pointer",
        "[&_svg]:size-7",
        "before:absolute before:-inset-1 before:-z-2 before:rounded-full before:bg-background",
        "after:absolute after:-inset-1 after:-z-1 after:rounded-full after:bg-[conic-gradient(from_30deg,#ffd295,#05968f,#cc392f,#ff9300,#8cd2f4,#984fa0,#ffd295)] after:opacity-0 after:transition-opacity",
        { "after:opacity-100 after:animate-spin": playing },
        className,
      )}
      size="icon-lg"
      onClick={handlePlayClick}
      variant="action"
      {...rest}
      data-playing={playing || undefined}
    >
      {!playing ? (
        <PlayIcon aria-label="Play" />
      ) : (
        <PauseIcon aria-label="Pause" />
      )}
    </Button>
  );

  if (disableTooltip) {
    return renderButton();
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{renderButton()}</TooltipTrigger>
      <TooltipContent className="flex items-center gap-x-2 z-(--z-ui-player)">
        {tooltipText}{" "}
        <KbdGroup>
          <Kbd>Space</Kbd> or <Kbd>K</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
};
