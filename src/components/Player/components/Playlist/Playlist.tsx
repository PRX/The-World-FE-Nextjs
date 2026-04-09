"use client";

/**
 * @file Playlist.tsx
 * List of audio in tracks. Click item to play that track. Each track item
 * should include option to remove track. Drag tracks to reorder them.
 */

import type React from "react";
import { useContext, useEffect, useMemo } from "react";
import type { PlayerAudio } from "../../types";
import { AnimatePresence, Reorder } from "framer-motion";
import debounce from "lodash/debounce";
import { PlayerContext } from "../../contexts";
import { PlaylistItem } from "./PlaylistItem";
import { cn } from "@/lib/util/css";

export type PlaylistProps = React.ComponentProps<"div">;

export const Playlist = ({ className, ...other }: PlaylistProps) => {
  const { state: playerState, setTracks } = useContext(PlayerContext);
  const { tracks } = playerState || {};

  const handleReorder = useMemo(
    () =>
      debounce(
        (newOrder: PlayerAudio[]) => {
          setTracks(newOrder);
        },
        100,
        {
          trailing: true,
        },
      ),
    [setTracks],
  );

  useEffect(() => () => {
    handleReorder.cancel();
  });

  return tracks?.length ? (
    <div
      {...other}
      className={cn("overflow-hidden overflow-y-auto", className)}
    >
      <Reorder.Group
        className="grid gap-4 w-fit"
        layoutScroll
        as="nav"
        axis="y"
        values={tracks}
        onReorder={handleReorder}
      >
        <AnimatePresence>
          {tracks?.map((track) => (
            <Reorder.Item as="div" value={track} key={track.id}>
              <PlaylistItem audio={track} />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  ) : null;
};
