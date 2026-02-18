import type { CSSProperties } from "react";
import {
  attributesToProps,
  type DOMNode,
  domToReact,
  type Element,
} from "html-react-parser";
import { ElementType } from "htmlparser2";
import { findDescendant, getElementAlignment } from "@/lib/dom";
import { cn } from "@/lib/utils";
import { replaceElement } from "./replaceElement";
import { replaceImage } from "./replaceImage";
import ImageViewer from "@/app/(main)/_components/ImageViewer";

export const replaceImageBlock = replaceElement(
  ["figure", "div"],
  (el, _index, options) => {
    const { attribs } = el;
    const figureProps = attributesToProps(attribs);
    const { width, height } = figureProps;
    const imgAspectRatio =
      typeof width === "string" && typeof height === "string"
        ? parseInt(width, 10) / parseInt(height, 10)
        : 3 / 4;
    const classes = (attribs.class || "").split(" ");
    const isImageBlock = classes.some((c) =>
      [
        "wp-block-image",
        "file-image",
        "media-image_on_left",
        "media-image_on_right",
      ].includes(c),
    );

    if (!isImageBlock) return;

    const imgElement = findDescendant(
      el,
      (node) => node.type === ElementType.Tag && node.name === "img" && node,
    );

    if (!imgElement) return;

    const { alignment, isAlignFull, isAlignWide, isFloated } =
      getElementAlignment(el);
    const figcaptionElement = findDescendant(
      el,
      (node) =>
        node.type === ElementType.Tag && node.name === "figcaption" && node,
    );
    let figCaptionChildren =
      ((figcaptionElement as Element).childNodes as DOMNode[]) || null;
    const imgWidths = (isFloated && [
      ["max-width: 768px", "100vw"],
      [null, "900px"],
    ]) ||
      (isAlignFull && [[null, "100vw"]]) ||
      (isAlignWide && [
        ["max-width: 768px", "100vw"],
        [null, "70vw"],
      ]) || [
        ["max-width: 768px", "100vw"],
        [null, "900px"],
      ];
    const imgProps = {
      className: cn("w-full rounded-md"),
      "data-slot": "figure-media",
      sizes: imgWidths.map(([q, w]) => (q ? `(${q}) ${w}` : w)).join(", "),
    };

    if (!figCaptionChildren) {
      const caption = findDescendant(
        el,
        (node) =>
          node.type === ElementType.Tag &&
          !!node.attribs.class?.includes("field-caption") &&
          node,
      );
      if (caption) {
        const credit = findDescendant(
          el,
          (node) =>
            node.type === ElementType.Tag &&
            !!node.attribs.class?.includes("image__credit") &&
            node,
        );

        if (credit) {
          (credit as Element).children = (credit as Element).children
            .filter(
              (n) =>
                n.type === ElementType.Tag &&
                !n.attribs.class?.includes("image__credit-label"),
            )
            .map((n) => {
              (n as Element).name = "span";
              return n;
            });
        }

        (credit as Element).name = "span";
        (credit as Element).attribs.class = "media-credit";

        (caption as Element).children.push(credit as Element);
      }

      figCaptionChildren = (caption as Element).children as DOMNode[];
    }

    delete figureProps.className;

    return (
      <figure
        {...figureProps}
        data-slot="figure-root"
        {...(!isFloated && { "data-align": alignment })}
        {...(isFloated && { "data-floated": alignment })}
        style={
          {
            "--aspect-ratio": imgAspectRatio,
            "--floated-max-w": "calc(var(--floated-max-h)*var(--aspect-ratio))",
          } as CSSProperties
        }
        className="my-12"
      >
        <div
          data-slot="figure-wrapper"
          className={cn("flex flex-col content-center gap-4", {
            "md:max-w-(--floated-max-w)": isFloated,
          })}
        >
          {domToReact([imgElement], {
            replace: (dn, i) => replaceImage(imgProps)(dn as Element, i, {}),
          })}
          {figCaptionChildren?.length && (
            <figcaption
              data-slot="figure-caption"
              className={cn(
                "grid grid-cols-[max-content_1fr] gap-4 justify-between items-start px-2",
              )}
            >
              <ImageViewer
                imageUrl={(imgElement as Element).attribs.src}
                altText={(imgElement as Element).attribs.alt}
                width={(imgElement as Element).attribs.width}
                height={(imgElement as Element).attribs.height}
              />
              <div
                className={cn(
                  "flex flex-wrap justify-between items-center gap-2 min-h-7.5",
                  "font-light text-sm/tight",
                  "[&_.media-credit]:whitespace-nowrap",
                )}
              >
                {domToReact(figCaptionChildren, options)}
              </div>
            </figcaption>
          )}
        </div>
      </figure>
    );
  },
);
