import type { ReplaceCallback } from "@/components/HtmlContent/types";
import { domToReact } from "html-react-parser";
import { findDescendant, getElementAlignment } from "@/lib/dom";
import { cn } from "@/lib/utils";
import { replaceElement } from "./replaceElement";

export const replacePullquote: ReplaceCallback = replaceElement(
  ["blockquote", "aside", "figure"],
  (el, _index, options) => {
    const { attribs, name } = el;
    const isPullquote =
      !!attribs.class && /\b(?:wp-block-)?pullquote\b/.test(attribs.class);

    if (!isPullquote) return;

    const { alignment, isFloated } = getElementAlignment(el);
    const blockquoteElement =
      name !== "figure"
        ? findDescendant(el, (n) => n.name === "div" && n)
        : findDescendant(el, (n) => n.name === "blockquote" && n);

    if (blockquoteElement) {
      let citeElement = findDescendant(
        blockquoteElement,
        (n) => n.name === "cite" && n,
      );

      if (!citeElement) {
        citeElement = findDescendant(el, (n) => n.name === "cite" && n);

        if (citeElement) {
          citeElement.parent = blockquoteElement;

          blockquoteElement.children.push(citeElement);
        }
      }

      blockquoteElement.name = "blockquote";
      blockquoteElement.attribs["data-slot"] = "pullquote-quote";
      blockquoteElement.attribs.class = cn(
        "flex flex-col gap-4 items-center text-center px-(--body-gutter) font-serif",
        {
          "py-12 text-3xl/tight": !isFloated,
          "w-(--floated-w) py-6 text-2xl/tight": isFloated,
        },
      );

      if (citeElement) {
        citeElement.attribs["data-slot"] = "pullquote-cite";
        citeElement.attribs.class = cn(
          "text-md text-current/80",
          "before:content-['-_']",
        );
      }

      return (
        <figure
          data-slot="pullquote"
          className={cn(
            "before:block before:w-full before:h-1 before:rounded-full before:bg-linear-[to_bottom_right,var(--gradient-body-divider-bg)] before:bg-fixed",
            "after:block after:w-full after:h-1 after:rounded-full after:bg-linear-[to_bottom_right,var(--gradient-body-divider-bg)] after:bg-fixed",
            {
              "my-12": !isFloated,
              "w-full": isFloated,
            },
          )}
          {...(!isFloated && { "data-align": alignment })}
          {...(isFloated && { "data-floated": alignment })}
        >
          {domToReact([blockquoteElement], options)}
        </figure>
      );
    }
  },
);
