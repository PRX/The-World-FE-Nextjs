import type React from "react";
import type { CSSProperties } from "react";
import type { ReplaceCallback } from "@/components/HtmlContent/types";
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
} from "./replacers";

export type ContentBodyProps = React.ComponentProps<typeof HtmlContent>;

export default function ContentBody({ children, ...props }: ContentBodyProps) {
  // TODO: Get color scheme from preferences/localstorage.

  // TODO: Layout markup and styling.

  // TODO: Add replacers for rich content blocks.
  const replacers: ReplaceCallback[] = [
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
  ];

  return (
    <div className={cn("mt-8 px-4 md:px-8")} data-scheme="default">
      <div
        style={
          {
            "--_gutter": 8,
            "--body-gutter": "calc(var(--spacing)*var(--_gutter,4))",
          } as CSSProperties
        }
        className={cn(
          "@container/body",
          "pt-9 pb-18 px-(--body-gutter) [--_gutter:8] md:[--_gutter:16]",
          "bg-body text-body-foreground rounded-t-lg",
          "[&_a]:text-body-primary [&_a]:hover:text-body-primary/60 [&_a]:visited:text-body-primary",
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
            "lg:*:data-[align=default]:-mx-(--body-gutter)",
            // Floated Blocks
            "md:*:data-floated:grid",
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
      <div className="bg-linear-to-b from-body to-body/0 from-10% to-90%">
        {children}
      </div>
    </div>
  );
}
