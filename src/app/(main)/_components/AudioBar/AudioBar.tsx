"use client";

import type { MediaItem } from "@/interfaces";
import {
  AddAudioButton,
  PlayAudioButton,
  PlayerContext,
  type PlayerAudio,
} from "@/components/Player";
import { cn } from "@/lib/util/css";
import { useContext } from "react";
import { formatDuration } from "@/lib/parse/time";

export type AudioBarProps = React.ComponentProps<"div"> & {
  audio: MediaItem;
  fallbackProps?: Partial<PlayerAudio>;
};

export default function AudioBar({
  audio,
  fallbackProps,
  className,
  ...props
}: AudioBarProps) {
  const { duration } = audio;
  const { isCurrentTrack, isPlaying, isQueued } = useContext(PlayerContext);

  return (
    <div
      className={cn(
        "flex justify-between items-center p-2 bg-navy-blue/80 bg-linear-to-r from-navy-blue/80 to-navy-blue/80 backdrop-blur-sm border border-transparent rounded-sm leading-1",
        "transition-[--tw-gradient-from,--tw-gradient-to,border-color]",
        {
          "to-purple border-purple": isQueued(audio.id),
          "from-cyan/50": isCurrentTrack(audio.id),
          "from-red": isPlaying(audio.id),
        },
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-x-2">
        <PlayAudioButton
          className={cn("text-cyan")}
          variant="ghost"
          audio={audio}
          fallbackProps={fallbackProps}
        />
        {!!duration && (
          <span className="leading-none">{formatDuration(duration)}</span>
        )}
      </span>
      <AddAudioButton
        className={cn("text-cyan")}
        variant="ghost"
        audio={audio}
        fallbackProps={fallbackProps}
      />
    </div>
  );
}
