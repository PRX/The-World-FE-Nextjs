/**
 * @file HtmlContent.tsx
 * Component for rendering HTML content.
 */

import type { Maybe } from "@/interfaces";
import type { ReplaceCallback } from "./types";
import parse, {
  type HTMLReactParserOptions,
  type DOMNode,
} from "html-react-parser";
import { cn } from "@/lib/utils";
import {
  anchorToLink,
  //   audioDescendant,
  //   datawrapperEmbed,
  //   datavizEmbed,
  //   facebookPost,
  //   facebookVideo,
  //   fbRootRemove,
  fixBlockInParagraph,
  fixNestedSpans,
  //   instagramEmbed,
  removeUnsupportedElementTypes,
  unwrapLegacyWrappers,
  //   tiktokEmbed,
  //   twitterEmbed,
  //   videoSourceDescendant,
  //   youtubeIframe,
} from "./transforms";
import { ElementType } from "htmlparser2";

export type HtmlContentProps = React.ComponentProps<"div"> & {
  html?: Maybe<string>;
  replacers?: ReplaceCallback[];
};

export const HtmlContent = ({
  className,
  html,
  replacers = [],
  ...divProps
}: HtmlContentProps) => {
  if (!html) return null;

  const cleanHtml = (dirtyHtml: string) =>
    [
      (h: string) =>
        h
          // Remove new line characters.
          .replace(/\r?\n|\r/g, "")
          // Remove empty tags or tags containing only spaces.
          .replace(/<[^>/]+>(\s|&nbsp;)*<\/[^>]+>/g, ""),
    ].reduce((acc, func) => func(acc), dirtyHtml);

  const options: HTMLReactParserOptions = {
    replace,
  };

  function replace(node: DOMNode, index: number) {
    return (
      [
        /* GLOBAL FIXES */

        removeUnsupportedElementTypes,
        unwrapLegacyWrappers,

        // Remove inline styles.
        // Keep an eye out for WP blocks potentially breaking.
        // Some block types may use inline styles for some options.
        (n: DOMNode) => {
          if (n.type === ElementType.Tag) {
            // eslint-disable-next-line no-param-reassign
            delete n.attribs.style;
          }
        },

        fixNestedSpans,
        fixBlockInParagraph,

        ...replacers,

        /* BLOCK LEVEL */

        /* INLINE */
        anchorToLink,
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
      ] as ReplaceCallback[]
    ).reduce(
      (acc: ReturnType<ReplaceCallback>, func) =>
        acc || acc === null ? acc : func(node, index, options),
      undefined,
    );
  }

  return (
    <div
      className={cn(
        // Block spacing.
        "[&>:where(*+:not([class*=my-],[class*=mt-]))]:mt-[1.2em]",
        // Anchor links.
        "[&_a]:underline [&_a]:underline-offset-4",
        // Lists.
        "[&_:where(ul,ol)]:ps-10 [&_ul]:list-disc [&_ol]:list-decimal",
        className,
      )}
      {...divProps}
    >
      {parse(cleanHtml(html), options)}
    </div>
  );
};
