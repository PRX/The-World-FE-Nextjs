"use client";

import { cn } from "@/lib/util/css";
import { useEffect, useState } from "react";

export type DatavizEmbedProps = React.ComponentProps<"div"> & {
  src: string;
  height?: string | number;
  title?: string;
  iframeProps?: React.ComponentProps<"iframe">;
};

export type TwDatavizMessageData = {
  type: "TwDatavizUpdateHeight";
  payload: number;
};

export function DatavizEmbed({
  src,
  height,
  title,
  className,
  iframeProps,
  ...props
}: DatavizEmbedProps) {
  const [iframeHeight, setIframeHeight] = useState(height);
  const { className: iframeClassName, title: iframeTitle } = iframeProps || {};

  useEffect(() => {
    function handleMessage(event: MessageEvent<TwDatavizMessageData>) {
      if (event.data.type === "TwDatavizUpdateHeight" && event.data.payload) {
        setIframeHeight(event.data.payload);
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div
      data-slot="datawrapper"
      className={cn("grid w-full", className)}
      {...props}
    >
      <iframe
        {...(iframeProps || { src, height })}
        data-slot="datawrapper-iframe"
        style={{ height: `${iframeHeight}px` }}
        className={cn("border-none bg-transparent", iframeClassName)}
        title={title || iframeTitle || "Data Visualization"}
        width="100%"
        loading="lazy"
        allowTransparency
      />
    </div>
  );
}
