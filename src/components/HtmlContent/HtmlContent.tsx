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
import { cn } from "@/lib/utils";
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
  className?: string;
  transforms?: ((
    // eslint-disable-next-line no-unused-vars
    N: DOMNode,
    // eslint-disable-next-line no-unused-vars
    F?: HTMLReactParserOptions["transform"],
    // eslint-disable-next-line no-unused-vars
    I?: number,
  ) => ReactElement | undefined | null)[];
}

export const HtmlContent = ({
  className,
  html,
  transforms = [],
}: IHtmlContentProps) => {
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
    <div
      className={cn(
        // Block spacing.
        "[&>*+*]:mt-[1.2em]",
        // Anchor links.
        "[&_a]:underline [&_a]:underline-offset-4",
        // Lists.
        "[&_:where(ul,ol)]:ps-10 [&_ul]:list-disc [&_ol]:list-decimal",
        className,
      )}
    >
      {parse(cleanHtml(html), {
        // transform: transform,
      })}
    </div>
  );
};
