"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  CodeIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  ListMinusIcon,
  ListXIcon,
} from "lucide-react";
import { useContext, useState } from "react";
import { PlayerContext } from "../../contexts";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EmbedModalContent } from "../EmbedModalContent";

export type PlayerMenuProps = React.ComponentProps<typeof DropdownMenu> & {
  triggerProps?: React.ComponentProps<typeof DropdownMenuTrigger>;
  contentProps?: React.ComponentProps<typeof DropdownMenuContent>;
};

export function PlayerMenu({
  triggerProps,
  contentProps,
  ...props
}: PlayerMenuProps) {
  const { className: triggerClassName } = triggerProps || {};
  const { className: contentClassName } = contentProps || {};
  const { state, clearPlaylist, removeTrack } = useContext(PlayerContext);
  const { currentTrackIndex, tracks } = state;
  const currentTrack =
    (currentTrackIndex || currentTrackIndex === 0) && tracks[currentTrackIndex];
  const { url: audioDownloadUrl } = currentTrack || {};
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu {...props}>
        <DropdownMenuTrigger
          className={cn("rounded-full cursor-pointer", triggerClassName)}
          {...triggerProps}
          asChild
        >
          <Button size="icon" variant="ghost">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn("", contentClassName)}
          {...contentProps}
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

            <DropdownMenuItem
              id="menu-embed-audio"
              onClick={() => {
                setIsEmbedDialogOpen(true);
              }}
            >
              <CodeIcon /> Embed Audio
            </DropdownMenuItem>

            {audioDownloadUrl && (
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
          className="z-(--z-ui) pb-8"
          aria-describedby="menu-embed-audio"
        >
          <DrawerHeader>
            <DrawerTitle>Embed Audio</DrawerTitle>
          </DrawerHeader>
          <EmbedModalContent />
        </DrawerContent>
      </Drawer>
    </>
  );
}
