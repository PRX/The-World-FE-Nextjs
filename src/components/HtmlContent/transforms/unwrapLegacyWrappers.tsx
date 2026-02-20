import { type DOMNode, domToReact } from "html-react-parser";
import type { ReplaceCallback } from "../types";
import { replaceElement } from "@/app/(main)/_components/ContentBody/replacers";

/**
 * Unwrap content of old layout styling wrappers that conflict/break current patterns.
 */
export const unwrapLegacyWrappers: ReplaceCallback = replaceElement(
  ["div"],
  (el, _index, options) => {
    const { attribs, parent, children } = el;
    const isRootDiv = !parent;
    const hasAttributes = !!Object.keys(attribs).length;
    const legacyClassList = ["nochop"];
    const hasLegacyClass =
      !!attribs.class &&
      legacyClassList.reduce((a, c) => a || attribs.class.includes(c), false);

    if ((isRootDiv && !hasAttributes) || hasLegacyClass) {
      if (isRootDiv) {
        // Remove parent from children so replacers can treat children as root element.
        children.forEach((n) => {
          n.parent = null;
        });
      }
      return <>{domToReact(children as DOMNode[], options)}</>;
    }
  },
);
