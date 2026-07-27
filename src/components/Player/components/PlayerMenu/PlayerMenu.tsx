"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/util/css";
import {
  CodeIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  ListMinusIcon,
  ListXIcon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../contexts";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EmbedModalContent } from "../EmbedModalContent";
import type { PlayerTrack } from "../../types";

export type PlayerMenuProps = React.ComponentProps<typeof DropdownMenu> & {
  triggerProps?: React.ComponentProps<typeof DropdownMenuTrigger>;
  contentProps?: React.ComponentProps<typeof DropdownMenuContent>;
};

export function PlayerMenu({
  triggerProps,
  contentProps,
  ...props
}: PlayerMenuProps) {
  const { className: triggerClassName, ...otherTriggerProps } =
    triggerProps || {};
  const { className: contentClassName, ...otherContentProps } =
    contentProps || {};
  const { state, clearPlaylist, removeTrack } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = state;
  const currentTrack =
    (currentTrackIndex || currentTrackIndex === 0) && tracks[currentTrackIndex];
  const { mediaType, url: audioDownloadUrl } = (currentTrack ||
    {}) as PlayerTrack;
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const canEmbed = ["audio", "youtube"].includes(mediaType);
  const canDownload = ["audio"].includes(mediaType);

  useEffect(() => {
    if (!tracks?.length) {
      setIsEmbedDialogOpen(false);
    }
  }, [tracks]);

  return (
    <>
      <DropdownMenu {...props}>
        <DropdownMenuTrigger
          className={cn("rounded-full cursor-pointer", triggerClassName)}
          {...otherTriggerProps}
          asChild
        >
          <Button size="icon" variant="ghost" aria-label="Player options">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn("", contentClassName)}
          {...otherContentProps}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                clearPlaylist();
              }}
            >
              <ListXIcon /> Clear Playlist
            </DropdownMenuItem>

            {currentTrack && (
              <DropdownMenuItem
                onClick={() => {
                  removeTrack(currentTrack);
                }}
              >
                <ListMinusIcon /> Remove From Playlist
              </DropdownMenuItem>
            )}

            {canEmbed && (
              <DropdownMenuItem
                id="menu-embed-audio"
                onClick={() => {
                  setIsEmbedDialogOpen(true);
                }}
              >
                <CodeIcon /> Embed Player
              </DropdownMenuItem>
            )}

            {audioDownloadUrl && canDownload && (
              <DropdownMenuItem asChild>
                <a
                  href={`/api/download-external?url=${encodeURIComponent(audioDownloadUrl)}`}
                  download
                >
                  <DownloadIcon /> Download Audio
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Embed Dialog */}
      <Drawer open={isEmbedDialogOpen} onOpenChange={setIsEmbedDialogOpen}>
        <DrawerContent
          className="z-(--z-ui-player-playlist) pb-[calc(var(--gutter-bottom)+(--spacing(4)))]"
          aria-describedby="menu-embed-audio"
        >
          <DrawerHeader>
            <DrawerTitle>Embed Audio</DrawerTitle>
            <DrawerDescription>
              <p>
                Adding this player to your site's content is a copy-paste away.
              </p>
            </DrawerDescription>
          </DrawerHeader>
          <EmbedModalContent />
        </DrawerContent>
      </Drawer>
    </>
  );
}
