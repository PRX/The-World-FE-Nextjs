import { PlayerContext, type PlayerYoutube } from "@/components/Player";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/util/css";
import { type CSSProperties, useContext, useState } from "react";

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
  const [isVideoFocused, setIsVideoFocused] = useState(false);

  return (
    isVideo && (
      <>
        <Drawer open={isVideoFocused} handleOnly />
        <div
          style={{ "--aspect-ratio": aspectRatio } as CSSProperties}
          className={cn(
            "fixed bottom-[calc(var(--gutter-bottom)+(--spacing(4)))] right-[calc(var(--gutter-right)+(--spacing(4)))]",
            "grid place-items-stretch aspect-(--aspect-ratio) rounded-md overflow-clip",
            { "w-100": aspectRatio > 1, "h-100": aspectRatio < 1 },
          )}
        >
          {mediaType === "youtube" && (
            <youtube-video
              ref={el}
              src={
                currentTrack.url || `https://www.youtube.com/watch?v=${videoId}`
              }
              className="min-w-auto min-h-auto"
            ></youtube-video>
          )}
        </div>
      </>
    )
  );
}
