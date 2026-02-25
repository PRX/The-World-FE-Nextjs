"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type DataWrapperEmbedProps = React.ComponentProps<"div"> & {
  src: string;
  height?: string | number;
  title?: string;
  iframeProps?: React.ComponentProps<"iframe">;
};

export function DataWrapperEmbed({
  src,
  height,
  title,
  className,
  iframeProps,
  ...props
}: DataWrapperEmbedProps) {
  const [iframeHeight, setIframeHeight] = useState(height);
  const { className: iframeClassName, title: iframeTitle } = iframeProps || {};

  useEffect(() => {
    function handleMessage(a: MessageEvent) {
      if (typeof a.data["datawrapper-height"] !== "undefined") {
        Object.entries(a.data["datawrapper-height"]).forEach(
          ([chartId, newHeight]) => {
            if (src?.includes(`/${chartId}/`)) {
              setIframeHeight(newHeight as number);
            }
          },
        );
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [src]);

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
