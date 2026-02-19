import type { CSSProperties } from "react";
import type { ReplaceCallback } from "@/components/HtmlContent/types";
import { attributesToProps, type DOMNode, domToReact } from "html-react-parser";
import ContentEmbed from "@/app/(main)/_components/ContentEmbed";
import { findDescendant, getElementAlignment } from "@/lib/dom";
import { replaceElement } from "./replaceElement";

const twitterEmbedUrlPattern =
  /(?:twitter|x)\.com\/[^/]+\/(?:status(?:es)?)\/(\w+)/;

export const replaceTweetEmbed: ReplaceCallback = replaceElement(
  ["div", "blockquote", "figure"],
  (el, _index, options) => {
    const { name, attribs } = el;
    const embedProps = {
      width: "100%",
      style: { maxWidth: "calc(var(--spacing)*135)" },
    };

    // Handle legacy oEmbed divs.
    if (
      name === "div" &&
      "data-oembed-url" in attribs &&
      twitterEmbedUrlPattern.test(attribs["data-oembed-url"])
    ) {
      return (
        <ContentEmbed
          provider="twitter"
          embedProps={{ ...embedProps, url: attribs["data-oembed-url"] }}
          data-align="default"
          style={{ "--max-w": "calc(var(--spacing)*135)" } as CSSProperties}
        />
      );
    }

    // Handle standard Tweet HTML.
    if (name === "blockquote" && attribs.class?.includes("twitter-tweet")) {
      const link = findDescendant(el, (n) => {
        if (
          n.name === "a" &&
          "href" in n.attribs &&
          twitterEmbedUrlPattern.test(n.attribs.href)
        ) {
          return n;
        }
        return false;
      });

      return (
        link && (
          <ContentEmbed
            provider="twitter"
            embedProps={{ ...embedProps, url: link.attribs.href }}
            data-align="default"
            style={{ "--max-w": "calc(var(--spacing)*135)" } as CSSProperties}
          />
        )
      );
    }

    // Handle WordPress embed wrapper.
    if (
      name === "figure" &&
      attribs.class?.includes("wwp-block-embed-twitter")
    ) {
      const { alignment, isFloated } = getElementAlignment(el);
      const link = findDescendant(
        el,
        (n) =>
          n.name === "a" &&
          "href" in n.attribs &&
          twitterEmbedUrlPattern.test(n.attribs.href) &&
          n,
      );
      const captionEl = findDescendant(el, (n) => n.name === "figcaption" && n);
      const captionProps = captionEl && {
        ...attributesToProps(captionEl.attribs),
        ...(captionEl.children && {
          children: domToReact(captionEl.children as DOMNode[], options),
        }),
      };

      return (
        link && (
          <ContentEmbed
            provider="twitter"
            embedProps={{ ...embedProps, url: link.attribs.href }}
            captionProps={captionProps}
            {...(!isFloated && { "data-align": alignment })}
            {...(isFloated && { "data-floated": alignment })}
            style={{ "--max-w": "calc(var(--spacing)*135)" } as CSSProperties}
          />
        )
      );
    }
  },
);
