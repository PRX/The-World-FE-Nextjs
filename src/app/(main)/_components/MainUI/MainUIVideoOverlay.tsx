import { type CSSProperties, useContext, useEffect, useState } from "react";
import { PlayerContext, type PlayerYoutube } from "@/components/Player";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/util/css";
import PipExitIcon from "@/assets/svg/icons/pip-exit.svg";
import PipEnterIcon from "@/assets/svg/icons/pip-enter.svg";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
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
   * Reset to focused video when all tracks have played.
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
    if (!isVideo) {
      setIsPipMode(true);
    }
  }, [isVideo]);

  return (
    isVideo && (
      <>
        <Drawer open={!isPipMode} handleOnly>
          <DrawerContent></DrawerContent>
        </Drawer>

        <div
          style={{ "--aspect-ratio": aspectRatio } as CSSProperties}
          className={cn(
            "group/video",
            "fixed bottom-[calc(var(--gutter-bottom)+(--spacing(4)))] right-[calc(var(--gutter-right)+(--spacing(4)))] z-(--z-ui)",
            "grid place-content-center",
            "*:col-span-full *:row-span-full",
            !isPipMode
              ? [
                  "top-4 left-4 z-(--z-ui-player)",
                  {
                    "grid-cols-1 grid-rows-[min-content]": aspectRatio > 1,
                    "grid-rows-1 grid-cols-[min-content]": aspectRatio < 1,
                  },
                ]
              : [
                  "place-content-stretch",
                  {
                    "w-100 max-w-[calc(100dvw-(--spacing(8)))]":
                      aspectRatio > 1,
                    "h-100 max-h-[calc(100dvh-var(--gutter-bottom)-(--spacing(8)))]":
                      aspectRatio < 1,
                  },
                  "before:absolute before:-bottom-4 before:-right-4 before:-top-40 before:-left-40 before:pointer-events-none",
                  "before:bg-radial-[at_100%_100%] before:bg-bottom-right before:from-dark-purple before:to-70%",
                ],
          )}
        >
          {mediaType === "youtube" && (
            <youtube-video
              ref={el}
              src={
                currentTrack.url || `https://www.youtube.com/watch?v=${videoId}`
              }
              config={{
                iv_load_policy: 3,
                disablekb: 1,
              }}
              className="aspect-(--aspect-ratio) min-w-auto min-h-auto rounded-md overflow-clip bg-cyan/30 backdrop-blur-lg"
            ></youtube-video>
          )}
          {isPipMode ? (
            <div
              className={cn(
                "opacity-0 pointer-events-none z-1",
                "hidden media-hover:grid place-content-start p-2",
                "bg-linear-to-br from-green to-green/0 to-80% rounded-md",
                "group-hover/video:opacity-100",
              )}
            >
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 pointer-events-auto cursor-pointer"
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
          ) : (
            <div
              className={cn(
                "opacity-0 pointer-events-none z-1",
                "hidden media-hover:grid place-content-end p-2",
                "bg-linear-to-tl from-green to-green/0 to-80% rounded-md",
                "group-hover/video:opacity-100",
              )}
            >
              <Tooltip>
                <TooltipTrigger>
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
          )}
        </div>
      </>
    )
  );
}
