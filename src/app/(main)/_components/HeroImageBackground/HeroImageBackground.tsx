"use client";

import type { Maybe, MediaItem } from "@/interfaces";
import { cn } from "@/lib/util/css";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export default function HeroImageBackground({ data }: { data: MediaItem }) {
  const { altText, mediaDetails, mediaItemUrl, sourceUrl } = data;
  const imageSrc = sourceUrl || mediaItemUrl;
  const { width, height } = mediaDetails || {};
  const aspectRatio = (width || 1) / (height || 1);
  const imageRef = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<Maybe<string> | undefined>(
    imageSrc,
  );

  /**
   * Watch for changes in image's current source, then update url used as background image.
   */
  useEffect(() => {
    // Listen for new load events.
    imageRef.current?.addEventListener("load", () => {
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Image loaded, setting current src:",
          imageRef.current?.currentSrc,
        );
      }
      setLoading(false);
      setLoaded(true);
      setCurrentSrc(imageRef.current?.currentSrc);
    });
  }, []);

  useEffect(() => {
    const isLoaded = !!imageRef.current?.complete;
    setLoaded(isLoaded);
    if (isLoaded && process.env.NODE_ENV !== "production") {
      console.log(
        "Image loaded from cache, setting current src:",
        imageRef.current?.currentSrc,
      );
    } else {
      setLoading(!!imageSrc);
    }
  }, [imageSrc]);

  if (!imageSrc) {
    return null;
  }

  return (
    <div className="absolute inset-0 grid -z-1 bg-navy-blue/50 mask-b-from-75%">
      <Image
        ref={imageRef}
        className={cn("absolute inset-0 transition-all", {
          "opacity-0": !loaded && !currentSrc,
          "opacity-100": loaded || !!(loading && currentSrc),
          "blur-lg": loading && currentSrc,
        })}
        style={
          {
            objectFit: "cover",
          } as CSSProperties
        }
        src={imageSrc}
        sizes={`(width <= ${aspectRatio * 100}vh) ${aspectRatio * 100}vh, 100vw`}
        alt={altText || ""}
        fill
        preload
        loading="eager"
      />
      <div className="absolute inset-0 opacity-60 bg-linear-to-r from-navy-blue to-10%"></div>
      <div className="absolute inset-0 bg-linear-to-t from-navy-blue to-navy-blue/25 to-75%"></div>
      <div className="absolute inset-0 opacity-40 bg-linear-to-l from-purple to-25%"></div>
    </div>
  );
}
