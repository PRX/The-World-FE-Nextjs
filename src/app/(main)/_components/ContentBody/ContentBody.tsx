"use client";

import type React from "react";
import type { CSSProperties } from "react";
import type { ReplaceCallback } from "@/components/HtmlContent/types";
import type { Preferences } from "@/interfaces";
import { HtmlContent } from "@/components/HtmlContent";
import { cn } from "@/lib/utils";
import {
  replaceImage,
  replaceImageBlock,
  replaceTweetEmbed,
  replaceQABlock,
  replaceFacebookEmbed,
  replaceInstagramEmbed,
  replaceYouTubeEmbed,
  replacePullquote,
  replaceVimeoEmbed,
  replaceTikTokEmbed,
  replaceAudioEmbed,
  replaceDatavizEmbed,
  replaceDataWrapperEmbed,
  replaceScrollGallery,
} from "./replacers";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type ContentBodyProps = React.ComponentProps<typeof HtmlContent>;

export default function ContentBody({ children, ...props }: ContentBodyProps) {
  const [preferences] = useLocalStorage<Preferences>("preferences");
  const { colorScheme } = preferences || {};

  const replacers: ReplaceCallback[] = [
    replaceScrollGallery,
    replaceImageBlock,
    replaceImage(),
    replaceInstagramEmbed,
    replaceFacebookEmbed,
    replaceTweetEmbed,
    replaceYouTubeEmbed,
    replaceVimeoEmbed,
    replaceTikTokEmbed,
    replacePullquote,
    replaceQABlock,
    replaceAudioEmbed,
    replaceDatavizEmbed,
    replaceDataWrapperEmbed,
  ];

  return (
    <section
      style={
        {
          "--_gutter": 8,
          "--_margin": 4,
          "--body-gutter": "calc(var(--spacing)*var(--_gutter,4))",
          "--body-margin": "calc(var(--spacing)*var(--_margin,4))",
        } as CSSProperties
      }
      className={cn("@container/body-root group/body", "mt-8")}
      data-color-scheme={colorScheme || "default"}
      aria-label="Content body"
    >
      <div
        className={cn(
          "@container/body",
          "pt-9 pb-18 px-(--body-gutter) mx-(--body-margin) md:[--_gutter:16] md:[--_margin:8]",
          "bg-body text-body-foreground rounded-t-lg",
          "[&_a]:text-body-primary [&_a]:hover:opacity-60 [&_a]:visited:text-body-primary",
          "default:[&_a]:text-body-foreground default:[&_a]:decoration-body-primary",
        )}
      >
        <HtmlContent
          style={
            {
              "--floated-w":
                "max(400px, ((100cqw - 740px - (var(--body-gutter) * 2)) / 2) + (var(--body-gutter) * 2))",
              "--floated-max-h": "60vh",
            } as CSSProperties
          }
          className={cn(
            "max-w-185 mx-auto text-pretty",

            /* BASE */
            // Headings
            "[&_:where(h2,h3,h4,h5,h6)]:font-bold [&>h2]:text-3xl [&>h3]:text-2xl",

            // IFrames
            "[&>iframe]:mx-auto [&>iframe]:my-16",

            /* ALIGNMENT */
            "*:data-[align=default]:-mx-[calc(var(--body-gutter)/2)] lg:*:data-[align=default]:-mx-(--body-gutter)",
            // Floated Blocks
            "md:*:data-floated:relative md:*:data-floated:grid md:*:data-floated:z-1",
            "md:*:data-floated:w-[max(var(--body-gutter)*4,var(--floated-w)-(100cqw-740px-var(--body-gutter)*2)/2)]  md:*:data-floated:max-w-(--floated-w) md:*:data-floated:m-8",
            "md:*:data-floated:*:data-[slot=figure-wrapper]:w-(--floated-w)",
            "md:*:data-[floated=left]:justify-end md:*:data-[floated=left]:float-start md:*:data-[floated=left]:-ms-(--body-gutter)!",
            "md:*:data-[floated=right]:float-end md:*:data-[floated=right]:-me-(--body-gutter)!",
            // Align Wide
            "md:*:data-[align=wide]:relative md:*:data-[align=wide]:w-[70dvw] md:*:data-[align=wide]:min-w-[calc(100%+var(--body-gutter)*2)] md:*:data-[align=wide]:left-1/2 md:*:data-[align=wide]:-translate-x-1/2",
            // Align Full
            "*:data-[align=full]:relative *:data-[align=full]:w-[100cqw] *:data-[align=full]:left-1/2 *:data-[align=full]:-translate-x-1/2",
            // Align Center
            "*:data-[align=center]:mx-(--body-gutter)",
          )}
          {...{
            ...props,
            replacers: [...(props.replacers || []), ...replacers],
          }}
        />
      </div>
      <div
        className={cn(
          "flex flex-col gap-y-18",
          "px-(--body-gutter) mx-(--body-margin) md:[--_gutter:16] md:[--_margin:8]",
          "bg-linear-to-b from-body to-body/0 from-10% to-[min(90%,10%+var(--spacing)*100)]",
        )}
      >
        {children}
      </div>
    </section>
  );
}
