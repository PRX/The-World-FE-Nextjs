/**
 * @file fixNestedSpans.tsx
 *
 * Unwrap nested spans.
 */
import { Element } from "html-react-parser";
import type { ReplaceCallback } from "../types";
import { findDescendant } from "@/lib/dom";

export const fixNestedSpans: ReplaceCallback = (node) => {
  const isSpan = node.type === "tag" && node.name === "span";

  if (isSpan) {
    const validDescendant = findDescendant(node, (n) => {
      if (
        (n instanceof Element &&
          (n.children?.length > 1 || Object.keys(n.attribs || {}).length)) ||
        n.type === "text"
      ) {
        return n;
      }
      return false;
    });

    if (validDescendant) {
      return validDescendant;
    }
  }

  return undefined;
};
