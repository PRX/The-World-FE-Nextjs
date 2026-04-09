import type { CSSProperties } from "react";
import type { ReplaceCallback } from "@/components/HtmlContent/types";
import type { VimeoEmbedProps } from "@/components/VimeoEmbed/VimeoEmbed";
import { attributesToProps, type DOMNode, domToReact } from "html-react-parser";
import ContentEmbed from "@/app/(main)/_components/ContentEmbed";
import { findDescendant, getElementAlignment } from "@/lib/dom";
import { replaceElement } from "./replaceElement";

const vimeoEmbedUrlPattern = /vimeo\.com/;

export const replaceVimeoEmbed: ReplaceCallback = replaceElement(
  ["figure", "div", "iframe", "video", "source"],
  (el, _index, options) => {
    const embedProps: Partial<VimeoEmbedProps> = {
      className: "rounded-lg overflow-clip",
    };
    const srcElement = findDescendant(el, (n) => {
      if (
        "data-oembed-url" in n.attribs &&
        vimeoEmbedUrlPattern.test(n.attribs["data-oembed-url"])
      ) {
        return n;
      }
      if (
        n.name === "figure" &&
        n.attribs.class?.includes("wp-block-embed-vimeo")
      ) {
        return n;
      }
      if ("src" in n.attribs && vimeoEmbedUrlPattern.test(n.attribs.src)) {
        return n;
      }
      return false;
    });

    if (!srcElement) return;

    const { name, attribs } = srcElement;

    // Handle legacy oEmbed divs.
    if (
      "data-oembed-url" in attribs &&
      vimeoEmbedUrlPattern.test(attribs["data-oembed-url"])
    ) {
      const { attribs: iframeAttribs } =
        findDescendant(el, (n) => n.name === "iframe" && n) || {};

      delete iframeAttribs?.key;

      const iframeProps = attributesToProps(iframeAttribs);
      const { width, height } = iframeAttribs || {};
      const aspectRatio =
        width && height
          ? parseInt(`${width}`, 10) / parseInt(`${height}`, 10)
          : 16 / 9;

      return (
        <ContentEmbed
          provider="vimeo"
          embedProps={{
            ...embedProps,
            iframeProps,
            url: attribs["data-oembed-url"],
          }}
          data-align="default"
          style={
            {
              "--max-w": "min(100%,70dvh*var(--aspect-ratio))",
              "--aspect-ratio": aspectRatio,
            } as CSSProperties
          }
        />
      );
    }

    // Handle standard embed HTML.
    if (name === "iframe") {
      const { width, height, src } = attribs || {};
      const iframeProps = attributesToProps(attribs);
      const aspectRatio =
        width && height
          ? parseInt(`${width}`, 10) / parseInt(`${height}`, 10)
          : 16 / 9;

      return (
        src && (
          <ContentEmbed
            provider="vimeo"
            embedProps={{ ...embedProps, iframeProps, url: src }}
            data-align="default"
            style={
              {
                "--max-w": "min(100%,70dvh*var(--aspect-ratio))",
                "--aspect-ratio": aspectRatio,
              } as CSSProperties
            }
          />
        )
      );
    }

    // Handle WordPress embed wrapper.
    if (attribs.class?.includes("wp-block-embed-vimeo")) {
      const { alignment, isFloated } = getElementAlignment(srcElement);
      const { attribs: iframeAttribs } =
        findDescendant(srcElement, (n) => n.name === "iframe" && n) || {};
      const { width, height, src } = iframeAttribs || {};
      const aspectRatio =
        width && height
          ? parseInt(`${width}`, 10) / parseInt(`${height}`, 10)
          : 16 / 9;
      const iframeProps = attributesToProps(iframeAttribs);
      const captionEl = findDescendant(
        srcElement,
        (n) => n.name === "figcaption" && n,
      );
      const captionProps = captionEl && {
        ...attributesToProps(captionEl.attribs),
        ...(captionEl.children && {
          children: domToReact(captionEl.children as DOMNode[], options),
        }),
      };

      return (
        src && (
          <ContentEmbed
            provider="vimeo"
            embedProps={{ ...embedProps, iframeProps, url: src }}
            captionProps={captionProps}
            {...(!isFloated && { "data-align": alignment })}
            {...(isFloated && { "data-floated": alignment })}
            style={
              {
                "--max-w": "min(100%,70dvh*var(--aspect-ratio))",
                "--aspect-ratio": aspectRatio,
              } as CSSProperties
            }
          />
        )
      );
    }
  },
);
