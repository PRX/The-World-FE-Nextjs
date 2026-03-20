import type { ReplaceCallback } from "@/components/HtmlContent/types";
import { type DOMNode, domToReact } from "html-react-parser";
import { findDescendant } from "@/lib/dom";
import { replaceElement } from "./replaceElement";
import { cn } from "@/lib/util/css";

export const replaceQABlock: ReplaceCallback = replaceElement(
  "div",
  (el, _index, options) => {
    const { attribs } = el;

    if (!attribs.class?.includes("qa-wrap")) return;

    const questionEl = findDescendant(
      el,
      (node) => !!node.attribs.class?.includes("qa-question") && node,
    );
    const answerEl = findDescendant(
      el,
      (node) => !!node.attribs.class?.includes("qa-answer") && node,
    );

    if (!questionEl || !answerEl) return;

    const hasBorder = !!attribs.class?.includes("qa-wrap--border-around");

    return (
      <div
        data-slot="qa-root"
        className={cn(
          "group/qa relative ps-7 -ms-7 my-8",
          "before:absolute before:inset-0 before:left-2 before:right-auto before:w-1 before:bg-linear-(--gradient-body-divider-bg) before:bg-fixed before:rounded-full",
          {
            "border border-current/20 rounded-sm py-2 pe-2 before:top-2 before:bottom-2":
              hasBorder,
          },
        )}
      >
        <div
          data-slot="qa-question"
          className="leading-snug text-pretty font-bold"
        >
          {domToReact(questionEl.children as DOMNode[], options)}
        </div>
        <div data-slot="qa-answer" className="leading-snug text-pretty mt-3">
          {domToReact(answerEl.children as DOMNode[], options)}
        </div>
      </div>
    );
  },
);
