import { attributesToProps, type DOMNode, domToReact } from "html-react-parser";
import type { ReplaceCallback } from "@/components/HtmlContent/types";
import { findDescendant, getElementAlignment } from "@/lib/dom";
import { replaceElement } from "./replaceElement";
import { DataWrapperEmbed } from "../../DataWrapperEmbed";
import { cn } from "@/lib/util/css";

const dataWrapperEmbedUrlPattern = /\bdatawrapper\b/;

export const replaceDataWrapperEmbed: ReplaceCallback = replaceElement(
  ["div", "figure", "iframe"],
  (el, _index, options) => {
    const iframeElement = findDescendant(
      el,
      (n) =>
        n.name === "iframe" &&
        dataWrapperEmbedUrlPattern.test(n.attribs.src) &&
        n,
    );

    if (!iframeElement) return;

    const { alignment, isFloated } = getElementAlignment(el);
    const { attribs: iframeAttribs } = iframeElement;
    const { src, height, title } = iframeAttribs;
    const iframeProps = attributesToProps(iframeAttribs);
    const captionEl = findDescendant(el, (n) => n.name === "figcaption" && n);
    const { attribs: captionAttribs, children: captionChildren } =
      captionEl || {};
    const captionProps = captionAttribs && {
      ...attributesToProps(captionAttribs),
      ...(captionChildren && {
        children: domToReact(captionChildren as DOMNode[], options),
      }),
    };
    const { class: captionClassName } = captionAttribs || {};

    return (
      <figure
        data-slot="datawrapper-embed"
        {...(!isFloated && { "data-align": alignment })}
        {...(isFloated && { "data-floated": alignment })}
      >
        <DataWrapperEmbed
          className="rounded-md overflow-clip bg-white p-6 light:px-(--body-gutter)"
          src={src}
          height={height}
          iframeProps={iframeProps}
          title={title}
        />
        {!!captionChildren?.length && (
          <figcaption
            data-slot="embed-caption"
            className={cn(
              "flex flex-col gap-y-2 font-light text-sm/tight px-2",
              captionClassName,
            )}
            {...captionProps}
          />
        )}
      </figure>
    );
  },
);
