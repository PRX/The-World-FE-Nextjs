import type { TikTokEmbedProps } from "@/components/TikTokEmbed";
import type { ReplaceCallback } from "@/components/HtmlContent/types";
import { attributesToProps, type DOMNode, domToReact } from "html-react-parser";
import ContentEmbed from "@/app/(main)/_components/ContentEmbed";
import { findDescendant, getElementAlignment } from "@/lib/dom";
import { replaceElement } from "./replaceElement";
import { CSSProperties } from "react";

const tikTokEmbedUrlPattern = /tiktok\.com/;

export const replaceTikTokEmbed: ReplaceCallback = replaceElement(
  ["blockquote", "figure"],
  (el, _index, options) => {
    const { name, attribs } = el;
    const embedProps: Partial<TikTokEmbedProps> = {
      className: "max-w-[100cqw]",
      style: {
        "--scale": "min(100cqw/var(--w),1)",
      } as CSSProperties,
      iframeProps: {
        className: "scale-(--scale) origin-left rounded-lg! overflow-clip",
      },
    };

    // Handle standard Tweet HTML.
    if ("cite" in attribs && tikTokEmbedUrlPattern.test(attribs.cite)) {
      const videoId = attribs["data-video-id"];
      return (
        <ContentEmbed
          provider="tiktok"
          embedProps={{
            ...embedProps,
            url: attribs.cite,
            videoId,
          }}
          data-align="default"
        />
      );
    }

    // Handle WordPress embed wrapper.
    if (name === "figure" && attribs.class?.includes("wp-block-embed-tiktok")) {
      const { alignment, isFloated } = getElementAlignment(el);
      const blockquoteEl = findDescendant(
        el,
        (n) => n.name === "blockquote" && n,
      );
      const { attribs: blockquoteAttribs } = blockquoteEl || {};
      const { cite, "data-video-id": videoId } = blockquoteAttribs || {};
      const captionEl = findDescendant(el, (n) => n.name === "figcaption" && n);
      const captionProps = captionEl && {
        ...attributesToProps(captionEl.attribs),
        ...(captionEl.children && {
          children: domToReact(captionEl.children as DOMNode[], options),
        }),
      };

      return (
        videoId && (
          <ContentEmbed
            provider="tiktok"
            embedProps={{ ...embedProps, url: cite, videoId }}
            captionProps={captionProps}
            {...(!isFloated && { "data-align": alignment })}
            {...(isFloated && { "data-floated": alignment })}
            style={
              {
                "--max-w": "min(100%,70dvh*var(--aspect-ratio))",
              } as CSSProperties
            }
          />
        )
      );
    }
  },
);
