"use client";

/**
 * @file PlaylistItem.tsx
 * Component to display track info in a playlist.
 */

import type React from "react";
import { useContext } from "react";
import { DateTime } from "@/components/DateTime";
import { PlayerContext } from "@/components/Player";
import { sanitizeIso8601Date } from "@/lib/sanitize";
import { cn } from "@/lib/util/css";
import {
  GripHorizontalIcon,
  ListMinusIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { generateContentLinkHref } from "@/lib/routing";
import { convertSecondsToDuration } from "@/lib/parse/time";
import type { PlayerTrack } from "../../types/PlayerTrack.type";

export type PlaylistItemProps = React.ComponentProps<"div"> & {
  audio: PlayerTrack;
};

export const PlaylistItem = ({
  audio,
  className,
  ...other
}: PlaylistItemProps) => {
  const { playTrack, removeTrack, togglePlayPause, isCurrentTrack, isPlaying } =
    useContext(PlayerContext);
  const { id, title, info, duration, linkResource } = audio;
  const linkResourceHref =
    linkResource?.link && generateContentLinkHref(linkResource.link);

  const handlePlayClick = () => {
    if (isCurrentTrack(id)) {
      togglePlayPause();
    } else {
      playTrack(audio);
    }
  };

  const handleRemoveTrackClick = () => {
    removeTrack(audio);
  };

  return (
    <div
      {...other}
      className={cn(
        "group/playlistItem relative grid grid-cols-[min-content_1fr_auto_min-content] items-center gap-2",
        className,
      )}
    >
      <div className="grid place-items-center p-2 cursor-grab">
        <GripHorizontalIcon className="media-hover:opacity-0 group-hover/playlistItem:opacity-100 transition-opacity" />
      </div>
      <div
        className={cn("relative p-3 rounded-sm", {
          "bg-linear-to-r from-purple/60": isCurrentTrack(id),
        })}
      >
        <div className="flex flex-col content-center gap-1">
          <span className="text-md/snug font-bold">{title}</span>
          {info?.length ? (
            <span className="text-sm/tight [&>*+*]:before:content-['\2022'] [&>*+*]:before:mx-1">
              {info
                .filter((t) => !!t)
                .map((value) => {
                  const dateValue = ((v) => {
                    try {
                      const d = sanitizeIso8601Date(v.split("T")[0]);
                      return Temporal.PlainDate.from(d);
                    } catch (_e) {
                      return null;
                    }
                  })(value);

                  return dateValue ? (
                    <DateTime
                      className=""
                      date={dateValue}
                      options={{
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }}
                      key={`${dateValue.toString()}`}
                    />
                  ) : (
                    <span className="" key={value}>
                      {value}
                    </span>
                  );
                })}
            </span>
          ) : null}
        </div>
        {linkResourceHref && (
          <Link
            href={linkResourceHref}
            className="absolute inset-0 hover:bg-current/10 rounded-sm"
            aria-label={`Read "${title}"`}
          />
        )}
      </div>
      <div className="text-sm">
        {duration ? convertSecondsToDuration(duration) : "--:--"}
      </div>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="cursor-pointer"
              aria-label={
                isPlaying(id) ? `Pause "${title}"` : `Play "${title}"`
              }
              onClick={handlePlayClick}
            >
              {isPlaying(id) ? <PauseIcon /> : <PlayIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="z-(--z-ui-player-playlist)">
            {isPlaying(id) ? "Pause" : "Play"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="cursor-pointer"
              aria-label={`Remove "${title}" from playlist`}
              onClick={handleRemoveTrackClick}
            >
              <ListMinusIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="z-(--z-ui-player-playlist)">
            Remove From Playlist
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
