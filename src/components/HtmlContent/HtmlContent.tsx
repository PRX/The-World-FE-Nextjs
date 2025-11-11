/**
 * @file HtmlContent.tsx
 * Component for rendering HTML content.
 */

import type { ReactElement, ReactNode } from "react";
import type { Maybe } from "@/interfaces";
import parse, {
  type HTMLReactParserOptions,
  type DOMNode,
} from "html-react-parser";
// import {
//   anchorToLink,
//   audioDescendant,
//   datawrapperEmbed,
//   datavizEmbed,
//   facebookPost,
//   facebookVideo,
//   fbRootRemove,
//   fixBlockInParagraph,
//   fixNestedSpans,
//   instagramEmbed,
//   removeScriptTag,
//   tiktokEmbed,
//   twitterEmbed,
//   videoSourceDescendant,
//   youtubeIframe,
// } from "./transforms";

export interface IHtmlContentProps {
  html?: Maybe<string>;
  transforms?: ((
    // eslint-disable-next-line no-unused-vars
    N: DOMNode,
    // eslint-disable-next-line no-unused-vars
    F?: HTMLReactParserOptions["transform"],
    // eslint-disable-next-line no-unused-vars
    I?: number,
  ) => ReactElement | undefined | null)[];
}

export const HtmlContent = ({ html, transforms = [] }: IHtmlContentProps) => {
  if (!html) return null;

  const cleanHtml = (dirtyHtml: string) =>
    [
      (h: string) =>
        h
          // Remove new line characters.
          .replace(/\r?\n|\r/g, "")
          // Remove empty tags or tags containing only spaces.
          .replace(/<[^>/]+>(\s|&nbsp;)*<\/[^>]+>/g, "")
          // Remove style tags.
          .replace(/<style[^>]*>.*<\/style>/g, ""),
    ].reduce((acc, func) => func(acc), dirtyHtml);

  // const transform = (_reactNode: ReactNode, node: DOMNode, index: number) =>
  //   [
  //     // Transform to add `key` attribute to all tag nodes.
  //     (n: DOMNode) => {
  //       if (n.type === "tag") {
  //         // eslint-disable-next-line no-param-reassign
  //         // n.attribs.key = `${n.parent?.attribs?.key || "root"}_${
  //         //   n.name
  //         // }:${index}`;
  //       }
  //     },
  //     // Transform to remove inline styles.
  //     // Keep an eye out for WP blocks potentially breaking.
  //     // Some block types may use inline styles to some options.
  //     (n: DOMNode) => {
  //       if (n.type === "tag") {
  //         // eslint-disable-next-line no-param-reassign
  //         delete n.attribs.style;
  //       }
  //     },
  //     removeScriptTag,
  //     fixNestedSpans,
  //     fixBlockInParagraph,
  //     ...transforms,
  //     anchorToLink,
  //     audioDescendant,
  //     datawrapperEmbed,
  //     datavizEmbed,
  //     facebookPost,
  //     facebookVideo,
  //     fbRootRemove,
  //     instagramEmbed,
  //     twitterEmbed,
  //     tiktokEmbed,
  //     videoSourceDescendant,
  //     youtubeIframe,
  //   ].reduce(
  //     (acc, func) => (acc || acc === null ? acc : func(node, transform, index)),
  //     undefined,
  //   );

  return (
    <>
      {parse(cleanHtml(html), {
        // transform: transform,
      })}
    </>
  );
};
