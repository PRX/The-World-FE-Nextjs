"use client";

import type { CSSProperties } from "react";
import type { DivPropsWithoutRef } from "react-html-props";
import { makeVimeoEmbedUrl } from "@/lib/parse/url";
import { cn } from "@/lib/utils";

export type VimeoEmbedProps = DivPropsWithoutRef & {
  url: string;
  width?: string | number;
  height?: string | number;
  iframeProps?: React.ComponentProps<"iframe">;
};

export function VimeoEmbed({
  url,
  width,
  height,
  className,
  iframeProps,
  ...props
}: VimeoEmbedProps) {
  const src = makeVimeoEmbedUrl(url);
  const {
    width: iframeWidth,
    height: iframeHeight,
    ...iframePropsRest
  } = iframeProps || {};
  const embedWidth = iframeWidth && iframeHeight ? iframeWidth : width;
  const embedHeight = iframeWidth && iframeHeight ? iframeHeight : height;
  const aspectRatio =
    embedWidth && embedHeight
      ? parseInt(`${embedWidth}`, 10) / parseInt(`${embedHeight}`, 10)
      : 16 / 9;

  delete iframePropsRest.style;

  return (
    <div
      data-slot="vimeo-embed"
      style={
        {
          "--aspect-ratio": aspectRatio,
          "--max-w": "min(100%,70dvh*var(--aspect-ratio))",
        } as CSSProperties
      }
      className={cn(
        "max-w-full aspect-(--aspect-ratio)",
        "[&>iframe]:size-full",
        className,
      )}
      {...props}
    >
      <iframe
        {...iframePropsRest}
        loading="lazy"
        allow="encrypted-media; accelerometer; gyroscope; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
        src={src}
      />
    </div>
  );
}
