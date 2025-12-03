"use client";

import type { MediaItem } from "@/interfaces";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export default function HeaderImage({ data }: { data: MediaItem }) {
  const { altText, mediaDetails, mediaItemUrl, sourceUrl } = data;
  const imageSrc = sourceUrl || mediaItemUrl;
  const { width, height } = mediaDetails || {};
  const aspectRatio = (width || 1) / (height || 1);
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>();

  /**
   * Watch for changes in image's current source, then update url used as background image.
   */
  useEffect(() => {
    // Listen for new load events.
    imageRef.current?.addEventListener("load", () => {
      console.log(
        "Image loaded, checking currentSrc:",
        imageRef.current?.currentSrc,
      );
      setLoaded(true);
      setCurrentSrc(imageRef.current?.currentSrc);
    });
  }, []);

  useEffect(() => {
    console.log(imageRef.current?.complete);
    setLoaded(!!imageRef.current?.complete);
    setCurrentSrc(imageSrc || undefined);
  }, [imageSrc]);

  if (!imageSrc) {
    return null;
  }

  return (
    <div className="absolute inset-0 grid -z-[1] bg-navy-blue/50 mask-b-from-75%">
      {/* Image element hidden with a mask so we can get srcset and sizes. */}
      <Image
        ref={imageRef}
        className="fixed inset-0 mask-[linear-gradient(transparent)]"
        style={
          {
            objectFit: "cover",
          } as CSSProperties
        }
        src={imageSrc}
        sizes={`(width <= ${aspectRatio * 100}vh) ${aspectRatio * 100}vh, 100vw`}
        alt={altText || ""}
        fill
        priority
      />
      <div
        style={
          {
            ...(loaded && { "--image": `url(${currentSrc})` }),
          } as CSSProperties
        }
        className={cn(
          "absolute inset-0 grid -z-[1] bg-(image:--image) bg-cover bg-fixed bg-center transition-opacity delay-200",
          {
            "opacity-0": !loaded,
            "opacity-100": loaded,
          },
        )}
      ></div>
      <div className="absolute inset-0 opacity-60 bg-linear-to-r from-navy-blue to-10%"></div>
      <div className="absolute inset-0 bg-linear-to-t from-navy-blue to-navy-blue/25 to-75%"></div>
      <div className="absolute inset-0 opacity-40 bg-linear-to-l from-purple to-25%"></div>
    </div>
  );
}
