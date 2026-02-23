"use client";

import { useEffect, useState } from "react";
import type { PlayerAudio } from "@/components/Player";
import type { MediaItem } from "@/interfaces";
import AudioBar from "@/app/(main)/_components/AudioBar";

type AudioPlayerProps = React.ComponentProps<"div"> & {
  src: string;
};

export default function AudioPlayer({
  src,
  className,
  ...props
}: AudioPlayerProps) {
  const { pathname } = new URL(src);
  const filename = pathname.split("/").pop();
  const [duration, setDuration] = useState(0);
  const [fallbackProps, setFallbackProps] = useState<Partial<PlayerAudio>>({
    title: `Audio File: ${filename}`,
  });
  const audioData: MediaItem = {
    // Minimum props for MediaItem.
    contentTypeName: "audio",
    databaseId: -1,
    mediaItemId: -1,
    isComment: false,
    isContentNode: false,
    isFrontPage: false,
    isPostsPage: false,
    isTermNode: false,

    // Used props.
    id: src,
    sourceUrl: src,
    duration,
  };

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = "metadata";

    function handleLoadedMetadata() {
      setDuration(audio.duration);
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
  }, [src]);

  useEffect(() => {
    setFallbackProps({
      info: [`Inline Audio: ${filename}`],
      linkResource: {
        // Minimum props for resource.
        contentTypeName: "audio",
        databaseId: -1,
        id: `parent:${src}`,
        isComment: false,
        isContentNode: false,
        isFrontPage: false,
        isPostsPage: false,
        isTermNode: false,

        // Used Props.
        title: document.title,
        link: document.location.pathname,
      },
    });
  }, [filename, src]);

  return (
    <AudioBar audio={audioData} fallbackProps={fallbackProps} {...props} />
  );
}
