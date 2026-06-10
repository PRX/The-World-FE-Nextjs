"use client";

/**
 * @file VolumeControls.tsx
 * Play progress bar control.
 */

import type React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../contexts";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/util/css";
import { Volume1Icon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

export type VolumeControlsProps = React.ComponentProps<"div"> & {
  disableTooltips?: boolean;
  muteButtonProps?: React.ComponentProps<typeof Button>;
};

export const VolumeControls: React.FC<VolumeControlsProps> = ({
  className,
  disableTooltips,
  muteButtonProps,
  ...other
}: VolumeControlsProps) => {
  const { audioElm, setVolume, toggleMute } = useContext(PlayerContext);
  const { volume = 0.8 } = audioElm || {};
  const [vol, setVol] = useState(volume);
  const [muted, setMuted] = useState(!!audioElm?.muted);
  const { className: muteButtonClassName, ...otherMuteButtonProps } =
    muteButtonProps || {};
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
      const updatedVolume = newVolume || newVolume === 0 ? newVolume : v || 0.8;

      setVol(setVolume(updatedVolume));
    },
    [setVolume, audioElm],
  );

  /**
   * Update volume based on slider position.
   */
  const handleSliderChange = (newValue: number | number[]) => {
    updateVolume(newValue as number);
  };

  const handleMuteClick = () => {
    setMuted(toggleMute());
  };

  useEffect(() => {
    const handleVolumeChange = () => {
      if (audioElm && audioElm.muted !== muted) {
        setMuted(audioElm.muted);
      }

      setVol(audioElm?.volume || vol);
    };

    audioElm?.addEventListener("volumechange", handleVolumeChange);

    return () => {
      audioElm?.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [audioElm, vol, muted]);

  const renderSlider = () => (
    <Slider
      className={cn(
        "w-25 pl-2 cursor-pointer transition-all transition-discrete",
        "media-hover:hidden media-hover:animate-out media-hover:fade-out-0",
        // "group-hover/volume:grid group-focus-within/volume:opacity-100",
        // "group-hover/volume:translate-0 group-focus-within/volume:translate-0",
        "group-hover/volume:grid group-hover/volume:animate-in group-hover/volume:fade-in-100",
      )}
      max={1}
      step={0.01}
      value={[vol]}
      onValueChange={handleSliderChange}
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={vol * 100}
      aria-valuetext={`${vol * 100}%`}
    />
  );

  const renderMuteButton = () => (
    <Button
      className={cn("rounded-full cursor-pointer", muteButtonClassName)}
      size="icon"
      variant="ghost"
      {...otherMuteButtonProps}
      onClick={handleMuteClick}
    >
      {muted ? (
        <VolumeOffIcon aria-label="Unmute volume" />
      ) : (
        <VolumeIcon aria-label="Mute volume" />
      )}
    </Button>
  );

  return (
    <div
      {...other}
      className={cn(
        "group/volume",
        "flex gap-x-1 rounded-full p-1",
        "hover:bg-navy-blue/30 focus-within:bg-navy-blue/30",
        className,
      )}
    >
      {disableTooltips ? (
        <>
          {renderSlider()}
          {renderMuteButton()}
        </>
      ) : (
        <>
          <Tooltip>
            <TooltipTrigger asChild>{renderSlider()}</TooltipTrigger>
            <TooltipContent className="flex gap-x-2 items-center z-(--z-ui-player)">
              Volume{" "}
              <KbdGroup>
                <Kbd>-</Kbd>,<Kbd>=</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>{renderMuteButton()}</TooltipTrigger>
            <TooltipContent className="flex gap-x-2 items-center z-(--z-ui-player)">
              {muted ? "Unmute" : "Mute"} <Kbd>M</Kbd>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
};
