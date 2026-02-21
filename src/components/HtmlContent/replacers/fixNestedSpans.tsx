import { type DOMNode, domToReact } from "html-react-parser";
import type { ReplaceCallback } from "../types";
import { replaceElement } from "@/app/(main)/_components/ContentBody/replacers";

/**
 * Unwrap nested spans without attributes.
 */
export const fixNestedSpans: ReplaceCallback = replaceElement(
  "span",
  (el, _index, options) => {
    const { children, attribs } = el;
    const hasAttributes = !!Object.keys(attribs).length;

    if (!hasAttributes) {
      return domToReact(children as DOMNode[], options);
    }

    return;
  },
);
