import type { CSSProperties } from "react";
import type { YouTubeEmbedProps } from "react-social-media-embed";
import type { ReplaceCallback } from "@/components/HtmlContent/types";
import {
  attributesToProps,
  type DOMNode,
  type Text,
  domToReact,
} from "html-react-parser";
import ContentEmbed from "@/app/(main)/_components/ContentEmbed";
import { findDescendant, getElementAlignment } from "@/lib/dom";
import { replaceElement } from "./replaceElement";

const youTubeEmbedUrlPattern = /youtube(?:-nocookie)?\.com|youtu.be/;

export const replaceYouTubeEmbed: ReplaceCallback = replaceElement(
  ["div", "iframe", "figure", "p"],
  (el, _index, options) => {
    const { name, attribs } = el;
    const embedProps: Partial<YouTubeEmbedProps> = {
      width: "100%",
      height: "100%",
      className: "relative aspect-(--aspect-ratio) rounded-lg! overflow-clip",
      youTubeProps: {
        className: "absolute inset-0",
        opts: {
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            rel: 0,
          },
        },
      },
    };

    // Handle legacy oEmbed divs.
    if (
      "data-oembed-url" in attribs &&
      youTubeEmbedUrlPattern.test(attribs["data-oembed-url"])
    ) {
      const { attribs: iframeAttribs } =
        findDescendant(el, (n) => n.name === "iframe" && n) || {};
      const { width, height } = iframeAttribs || {};
      const aspectRatio =
        width && height
          ? parseInt(`${width}`, 10) / parseInt(`${height}`, 10)
          : 16 / 9;

      return (
        <ContentEmbed
          provider="youtube"
          embedProps={{
            ...embedProps,
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
    if (name === "iframe" && youTubeEmbedUrlPattern.test(attribs.src)) {
      const { width, height, src } = attribs || {};
      const aspectRatio =
        width && height
          ? parseInt(`${width}`, 10) / parseInt(`${height}`, 10)
          : 16 / 9;

      return (
        src && (
          <ContentEmbed
            provider="youtube"
            embedProps={{ ...embedProps, url: src }}
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
    if (
      name === "figure" &&
      attribs.class?.includes("wp-block-embed-youtube")
    ) {
      const { alignment, isFloated } = getElementAlignment(el);
      const { attribs: iframeAttribs } =
        findDescendant(el, (n) => n.name === "iframe" && n) || {};
      const { width, height, src } = iframeAttribs || {};
      const aspectRatio =
        width && height
          ? parseInt(`${width}`, 10) / parseInt(`${height}`, 10)
          : 16 / 9;
      const captionEl = findDescendant(el, (n) => n.name === "figcaption" && n);
      const captionProps = captionEl && {
        ...attributesToProps(captionEl.attribs),
        ...(captionEl.children && {
          children: domToReact(captionEl.children as DOMNode[], options),
        }),
      };

      return (
        src && (
          <ContentEmbed
            provider="youtube"
            embedProps={{ ...embedProps, url: src }}
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

    // Handle parent contains single child that is <a> tag with text that is a `youtube://` URL.
    const ytProtocolPattern = /^youtube:\/\/v/;
    const videoLinkUrl = (
      findDescendant(
        el,
        (n) =>
          n.name === "a" &&
          n.childNodes[0]?.type === "text" &&
          ytProtocolPattern.test(n.childNodes[0].data) &&
          n,
      )?.childNodes[0] as Text
    )?.data;
    console.log(videoLinkUrl, el.childNodes.length);
    if (el.childNodes.length === 1 && videoLinkUrl) {
      const embedUrl = videoLinkUrl.replace(
        ytProtocolPattern,
        "https://www.youtube.com/embed",
      );

      console.log(embedUrl);

      return (
        embedUrl && (
          <ContentEmbed
            provider="youtube"
            embedProps={{ ...embedProps, url: embedUrl }}
            data-align="default"
            style={
              {
                "--max-w": "min(100%,70dvh*var(--aspect-ratio))",
                "--aspect-ratio": 16 / 9,
              } as CSSProperties
            }
          />
        )
      );
    }
  },
);
