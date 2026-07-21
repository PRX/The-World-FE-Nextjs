"use client";

import { type CSSProperties, useContext, useEffect, useState } from "react";
import { PlayerContext, type PlayerYoutube } from "@/components/Player";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/util/css";
import PipExitIcon from "@/assets/svg/icons/pip-exit.svg";
import PipEnterIcon from "@/assets/svg/icons/pip-enter.svg";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// export type MainUIVideoOverlayProps = {
// };

export default function MainUIVideoOverlay() {
  const { el, state: playerState } = useContext(PlayerContext);
  const { tracks, currentTrackIndex } = playerState || {};
  const currentTrack = tracks[currentTrackIndex];
  const {
    mediaType,
    id: videoId,
    aspectRatio,
  } = (currentTrack || {}) as PlayerYoutube;
  const isVideo = ["youtube"].includes(mediaType);
  const [isPipMode, setIsPipMode] = useState(false);

  const exitPipMode = () => {
    setIsPipMode(false);
  };

  const enterPipMode = () => {
    setIsPipMode(true);
  };

  /**
   * Reset to PIP mode when all tracks have played.
   */
  useEffect(() => {
    if (!tracks.length) {
      setIsPipMode(false);
    }
  }, [tracks]);

  /**
   * When non-video track is played, switch video to PIP.
   */
  useEffect(() => {
    if (currentTrack && !isVideo) {
      setIsPipMode(true);
    }
  }, [currentTrack, isVideo]);

  return (
    isVideo && (
      <>
        <Drawer open={!isPipMode} handleOnly>
          <DrawerContent
            overlayProps={{ className: "z-[calc(var(--z-ui-player-video)-1)]" }}
          ></DrawerContent>
        </Drawer>

        <div
          style={
            {
              "--aspect-ratio": aspectRatio,
            } as CSSProperties
          }
          className={cn(
            "group/video @container/video",
            "fixed top-4 left-4 bottom-[calc(var(--gutter-bottom)+(--spacing(4)))] right-[calc(var(--gutter-right)+(--spacing(4)))] z-(--z-ui-player-video)",
            isPipMode && [
              "top-[calc(var(--gutter-top)+(--spacing(4)))] left-[calc(var(--gutter-left)+(--spacing(4)))]",
              "before:absolute before:-bottom-4 before:-right-4 before:size-100 before:pointer-events-none",
              "before:bg-radial-[at_100%_100%] before:bg-bottom-right before:from-dark-purple before:to-70%",
            ],
          )}
        >
          <div
            className={cn(
              "pointer-events-auto",
              "flex place-content-center",
              "absolute inset-0 m-auto",
              "aspect-(--aspect-ratio) max-w-full max-h-full",
              isPipMode && [
                "mr-0 mb-0",
                "max-h-[min(--spacing(100),100%)] max-w-[min(--spacing(100),100%)]",
              ],
            )}
          >
            {mediaType === "youtube" && (
              <youtube-video
                ref={el}
                src={
                  currentTrack.url ||
                  `https://www.youtube.com/watch?v=${videoId}`
                }
                config={{
                  iv_load_policy: 3,
                  disablekb: 1,
                }}
                className={cn(
                  "aspect-(--aspect-ratio) min-w-auto min-h-auto",
                  "rounded-md overflow-clip",
                  "bg-cyan/30 backdrop-blur-lg",
                  "shadow-navy-blue shadow",
                )}
              ></youtube-video>
            )}
            {isPipMode ? (
              <div
                className={cn(
                  "absolute w-full aspect-(--aspect-ratio)",
                  "opacity-0 pointer-events-none z-1",
                  "hidden media-hover:grid place-content-start",
                  "group-hover/video:opacity-100",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2",
                    "rounded-tl-md rounded-br-md p-2",
                    "bg-green/50 backdrop-blur-sm",
                  )}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="pointer-events-auto cursor-pointer"
                        onClick={() => {
                          exitPipMode();
                        }}
                      >
                        <PipExitIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="z-(--z-ui-player)">
                      Exit Picture-In-Picture
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "absolute w-full aspect-(--aspect-ratio)",
                  // "aspect-(--aspect-ratio) min-w-auto min-h-auto max-w-400 max-h-(--max-h)",
                  "opacity-0 pointer-events-none z-1",
                  "hidden media-hover:grid place-content-end",
                  "group-hover/video:opacity-100",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2",
                    "rounded-tl-md rounded-br-md p-2",
                    "bg-purple/50 backdrop-blur-sm",
                  )}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="pointer-events-auto cursor-pointer"
                        onClick={() => {
                          enterPipMode();
                        }}
                      >
                        <PipEnterIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="z-(--z-ui-player)">
                      Enter Picture-In-Picture
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )
  );
}
