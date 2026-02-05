"use client";

/**
 * @file VolumeControls.tsx
 * Play progress bar control.
 */

import type React from "react";
import { useCallback, useContext } from "react";
import { PlayerContext } from "../../contexts";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Volume1Icon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Kbd } from "@/components/ui/kbd";

export type VolumeControlsProps = React.ComponentProps<"div"> & {
  muteButtonProps?: React.ComponentProps<typeof Button>;
};

export const VolumeControls: React.FC<VolumeControlsProps> = ({
  className,
  muteButtonProps,
  ...other
}: VolumeControlsProps) => {
  const { audioElm, state, setVolume, toggleMute } = useContext(PlayerContext);
  const { volume, muted } = state;
  let VolumeIcon = Volume2Icon;

  if (volume === 0) {
    VolumeIcon = VolumeOffIcon;
  } else if (volume < 0.5) {
    VolumeIcon = Volume1Icon;
  }

  /**
   * Update player progress visuals.
   */
  const updateVolume = useCallback(
    (newVolume?: number) => {
      const { volume: v } = audioElm || {};
      const updatedVolume = newVolume || newVolume === 0 ? newVolume : v;

      setVolume(updatedVolume || volume);
    },
    [audioElm, setVolume, volume],
  );

  /**
   * Update volume based on slider position.
   */
  const handleSliderChange = (newValue: number | number[]) => {
    updateVolume(newValue as number);
  };

  const handleMuteClick = () => {
    toggleMute();
  };

  if (!audioElm) return null;

  return (
    <div
      {...other}
      className={cn(
        "group/volume",
        "grid grid-cols-[minmax(100px,1fr)_min-content] gap-x-1 rounded-full p-1 pl-3",
        "hover:bg-input focus-within:bg-input",
        className,
      )}
    >
      <Slider
        className={cn(
          "w-full max-w-25 cursor-pointer transition-opacity",
          "media-hover:opacity-0",
          "group-hover/volume:opacity-100 group-focus-within/volume:opacity-100",
        )}
        max={1}
        step={0.01}
        value={[volume]}
        onValueChange={handleSliderChange}
        aria-label="Volume Slider"
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="rounded-full cursor-pointer"
            size="icon"
            variant="ghost"
            {...muteButtonProps}
            onClick={handleMuteClick}
          >
            {muted ? <VolumeOffIcon /> : <VolumeIcon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="z-(--z-ui)">
          {muted ? "Unmute" : "Mute"} <Kbd>M</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
