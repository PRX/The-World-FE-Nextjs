"use client";

import type {
  FacebookEmbedProps,
  InstagramEmbedProps,
  XEmbedProps,
  YouTubeEmbedProps,
} from "react-social-media-embed";
import type { VimeoEmbedProps } from "@/components/VimeoEmbed/VimeoEmbed";
import type { TikTokEmbedProps } from "@/components/TikTokEmbed";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const XEmbed = dynamic(
  () => import("react-social-media-embed").then((mod) => mod.XEmbed),
  { ssr: false },
);
const FacebookEmbed = dynamic(
  () => import("react-social-media-embed").then((mod) => mod.FacebookEmbed),
  { ssr: false },
);
const InstagramEmbed = dynamic(
  () => import("react-social-media-embed").then((mod) => mod.InstagramEmbed),
  { ssr: false },
);
const YouTubeEmbed = dynamic(
  () => import("react-social-media-embed").then((mod) => mod.YouTubeEmbed),
  { ssr: false },
);
const VimeoEmbed = dynamic(
  () => import("@/components/VimeoEmbed").then((mod) => mod.VimeoEmbed),
  { ssr: false },
);
const TikTokEmbed = dynamic(
  () => import("@/components/TikTokEmbed").then((mod) => mod.TikTokEmbed),
  { ssr: false },
);

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
    | {
        provider: "instagram";
        embedProps: InstagramEmbedProps;
      }
    | {
        provider: "youtube";
        embedProps: YouTubeEmbedProps;
      }
    | {
        provider: "vimeo";
        embedProps: VimeoEmbedProps;
      }
    | {
        provider: "tiktok";
        embedProps: TikTokEmbedProps;
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
  // biome-ignore lint/suspicious/noExplicitAny: May create a union type if needed.
  const EmbedComp = new Map<string, any>([
    ["twitter", XEmbed],
    ["facebook", FacebookEmbed],
    ["instagram", InstagramEmbed],
    ["youtube", YouTubeEmbed],
    ["vimeo", VimeoEmbed],
    ["tiktok", TikTokEmbed],
  ]).get(provider);

  if (!EmbedComp) return null;

  return (
    <figure
      data-slot="embed"
      {...props}
      className={cn(
        "@container/embed group/embed",
        "relative isolate grid my-16",
        "grid-cols-[[full-start]_1fr_[content-start]_var(--max-w,max-content)_[content-end]_1fr_[full-end]]",
        {
          "grid-rows-[[content-start]_1fr_[content-end_caption-start]_min-content_[caption-end]]":
            captionProps,
        },
        className,
      )}
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
        className="col-[content] row-[content] drop-shadow-lg aspect-(--aspect-ratio)"
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
