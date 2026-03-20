/**
 * @file TikTokEmbed.tsx
 * Component for displaying formatted time.
 */

import { type CSSProperties, useEffect, useState } from "react";
import type { DivPropsWithoutRef } from "react-html-props";
import { cn } from "@/lib/util/css";

export type TikTokEmbedProps = DivPropsWithoutRef & {
  url: string;
  videoId: string;
  iframeProps?: React.ComponentProps<"iframe">;
};

export function TikTokEmbed({
  className,
  style,
  url,
  videoId,
  iframeProps,
  ...props
}: TikTokEmbedProps) {
  const [iframeDimensions, setIframeDimensions] = useState<{
    width: number;
    height: number;
  }>();
  const { width, height } = iframeDimensions || {};
  const aspectRatio =
    width && height
      ? parseInt(`${width}`, 10) / parseInt(`${height}`, 10)
      : 9 / 16;
  const src = `https://www.tiktok.com/embed/v2/${videoId}?embedFrom=oembed`;

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!e.data.startsWith?.("{")) return;

      const data = JSON.parse(e.data);

      if (!data.signalSource || !data.height) return;

      const { width = 325, height } = data;

      setIframeDimensions({ width, height });
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div
      className={cn(
        "tiktok-embed",
        "relative w-full aspect-(--aspect-ratio)",
        "[&_iframe]:w-(--w) [&_iframe]:h-(--h,100%)",
        className,
      )}
      style={
        {
          ...style,
          "--aspect-ratio": aspectRatio,
          ...(iframeDimensions && {
            "--w": `${iframeDimensions.width}px`,
            "--h": `${iframeDimensions.height}px`,
          }),
        } as CSSProperties
      }
      {...props}
    >
      <blockquote className="contents" cite={url} data-video-id={videoId}>
        <iframe
          {...iframeProps}
          name={`__tt_embed__v${videoId}`}
          title={`TikTok Video Embed - ${videoId}`}
          src={src}
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation-by-user-activation"
        />
      </blockquote>
    </div>
  );
}
