/**
 * @file fixBlockInParagraph.tsx
 *
 * Unwrap paragraph content that contain a paragraph.
 */
import { type DOMNode, domToReact } from "html-react-parser";
import type { ReplaceCallback } from "../types";
import { findDescendant } from "@/lib/dom";
import { uniqueId } from "lodash";
import { ElementType } from "htmlparser2";

export const fixBlockInParagraph: ReplaceCallback = (node, _index, options) => {
  const isParagraph = node.type === "tag" && node.name === "p";
  const blockTags = [
    "blockquote",
    "div",
    "figure",
    "table",
    "ul",
    "ol",
    "iframe",
  ];
  const blockDescendant = findDescendant(node, (n: DOMNode) => {
    if (n.type === "tag" && blockTags.includes(n.name)) {
      return n;
    }
    return false;
  });

  if (isParagraph && blockDescendant) {
    const children: ReturnType<typeof domToReact>[] = [];
    let pChildren: ReturnType<typeof domToReact>[] = [];

    node.children
      .map((n: DOMNode) => {
        if (n.type === "text") {
          return (n.data as string)?.trim().length ? n : null;
        }
        return n;
      })
      .filter((v: DOMNode | null) => !!v)
      .forEach((n: DOMNode) => {
        const isTag = n.type === ElementType.Tag;
        if (isTag) {
          n.attribs.key = uniqueId();
        }
        if (isTag && blockTags.includes(n.name)) {
          // Add stored paragraph children to output children and reset store.
          if (pChildren.length) {
            children.push(<p key={uniqueId()}>{[...pChildren]}</p>);
            pChildren = [];
          }
          // Append rendered block element to output children.
          children.push(domToReact([n], options));
        } else {
          // Store rendered paragraph child.
          pChildren.push(domToReact([n], options));
        }
      });

    // Add any remaining stored children to output children.
    if (pChildren.length) {
      children.push(<p key={uniqueId()}>{[...pChildren]}</p>);
    }

    return <>{children.map((c) => c)}</>;
  }

  return undefined;
};
