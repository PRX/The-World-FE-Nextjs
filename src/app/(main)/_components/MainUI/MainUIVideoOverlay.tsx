"use client";

import { type CSSProperties, useContext, useEffect, useState } from "react";
import {
  type IPlayerState,
  PlayerContext,
  type PlayerYoutube,
} from "@/components/Player";
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

const videoMediaTypes = new Set(["youtube"]);

// export type MainUIVideoOverlayProps = {
// };

export default function MainUIVideoOverlay() {
  const { el, state: playerState } = useContext(PlayerContext);
  const { tracks, currentTrackIndex, standalone } = playerState || {};
  const currentTrack = tracks[currentTrackIndex];
  const {
    mediaType,
    id: videoId,
    aspectRatio,
  } = (currentTrack || {}) as PlayerYoutube;
  const isVideo = videoMediaTypes.has(mediaType);
  const [isInit, setIsInit] = useState(true);
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

  /**
   * Init in PIP mode if tracks exist during init.
   */
  useEffect(() => {
    if (!isInit || standalone) return;

    const playerStateJson = localStorage?.getItem("playerState");

    if (playerStateJson) {
      const { tracks: t } = JSON.parse(playerStateJson) as IPlayerState;

      if (t.length) {
        setIsPipMode(true);
      }
    }

    setIsInit(false);
  }, [isInit, standalone]);

  return (
    isVideo && (
      <>
        {/* Use empty drawer to act as backdrop for video and disable page scrolling, when not in PIP mode. */}
        <Drawer open={!isPipMode} handleOnly>
          <DrawerContent
            overlayProps={{ className: "z-[calc(var(--z-ui-player-video)-1)]" }}
          ></DrawerContent>
        </Drawer>

        {/**
         * Video overlay element that defines the where the video can be shown.
         * */}
        <div
          style={
            {
              "--aspect-ratio": aspectRatio,
            } as CSSProperties
          }
          className={cn(
            "fixed z-(--z-ui-player-video)",
            // Full size video can cover all UI except player, with some space from edges.
            "top-4 left-4 bottom-[calc(var(--gutter-bottom)+(--spacing(4)))] right-4",
            isPipMode && [
              "pointer-events-none",
              // Limit PIP video area to content area (inside gutter), with some space from edges.
              "top-[calc(var(--gutter-top)+(--spacing(4)))] left-[calc(var(--gutter-left)+(--spacing(4)))] right-[calc(var(--gutter-right)+(--spacing(4)))]",
              // Add a gradient behind video to help visually anchor to player and improve contrast with content behind video.
              "before:absolute before:-bottom-4 before:-right-4 before:size-100",
              "before:bg-radial-[at_100%_100%] before:bg-bottom-right before:from-dark-purple before:to-70%",
            ],
          )}
        >
          {/**
           * Video wrapper element that defines the size and position of video.
           * Responsible for controlling containment within overlay area and video dimensions.
           * */}
          <div
            className={cn(
              "group/video",
              "pointer-events-auto",
              "flex place-content-center",
              "absolute inset-0 m-auto",
              "aspect-(--aspect-ratio) max-w-full max-h-full",
              // Limit full size video to Full HD dimensions using shortest edge.
              // Landscape: 1920 x 1080, Portrait: 1080 x 1920
              {
                "max-h-[min(1080px,100%)]": aspectRatio >= 1,
                "max-w-[min(1080px,100%)]": aspectRatio < 1,
              },
              isPipMode && [
                // Position video to bottom right of video overlay.
                "mr-0 mb-0",
                // Limit PIP size video to SD dimensions using shortest edge.
                // Landscape: 854 x 480, Portrait: 480 x 854
                "max-h-[min(480px,100%)] max-w-[min(480px,100%)]",
              ],
              "rounded-md overflow-clip",
              "bg-cyan/30 backdrop-blur-lg",
              "shadow-navy-blue shadow",
              "*:size-full",
            )}
          >
            {/* VIDEO ELEMENTS */}

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
              ></youtube-video>
            )}

            {/* VIDEO CONTROL OVERLAYS */}

            {isPipMode ? (
              <div
                className={cn(
                  "absolute inset-0",
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
                  "absolute inset-0",
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
