"use client";

import { cn } from "@/lib/utils";
import {
  FacebookEmbed,
  type FacebookEmbedProps,
  XEmbed,
  type XEmbedProps,
} from "react-social-media-embed";

export type ContentEmbedProps = React.ComponentProps<"div"> & {
  captionProps?: React.ComponentProps<"figcaption">;
} & (
    | {
        provider: "twitter";
        embedProps: XEmbedProps;
      }
    | {
        provider: "facebook";
        embedProps: FacebookEmbedProps;
      }
  );

export default function ContentEmbed({
  className,
  captionProps,
  provider,
  embedProps,
  ...props
}: ContentEmbedProps) {
  const { className: captionClassName } = captionProps || {};
  const EmbedComp = new Map([
    ["twitter", XEmbed],
    ["facebook", FacebookEmbed],
  ]).get(provider);

  if (!EmbedComp) return null;

  return (
    <figure
      data-slot="embed"
      className={cn(
        "relative isolate grid my-16",
        "grid-cols-[[full-start]_1fr_[content-start]_var(--max-w,max-content)_[content-end]_1fr_[full-end]]",
        {
          "grid-rows-[[content-start]_1fr_[content-end_caption-start]_min-content_[caption-end]]":
            captionProps,
        },
        className,
      )}
      {...props}
    >
      <div
        data-slot="embed-backdrop"
        className={cn(
          "col-[full] row-[content] rounded-lg my-4 overflow-clip -z-1",
          "bg-navy-blue/30 backdrop-blur-lg dark:bg-blue/30 light:bg-blue",
          "before:absolute before:inset-0 before:bg-linear-to-tl before:from-purple before:to-purple/0",
          "after:absolute after:inset-0 after:bg-linear-to-tr after:from-green after:to-green/0 after:to-40%",
        )}
      />
      <div
        data-slot="embed-content"
        className="col-[content] row-[content] drop-shadow-lg"
      >
        <EmbedComp {...embedProps} />
      </div>
      {captionProps && (
        <figcaption
          data-slot="embed-caption"
          className={cn("col-[full] row-[caption]", captionClassName)}
          {...captionProps}
        />
      )}
    </figure>
  );
}
