import { attributesToProps, type DOMNode, domToReact } from "html-react-parser";
import type { ReplaceCallback } from "@/components/HtmlContent/types";
import { findDescendant, getElementAlignment } from "@/lib/dom";
import { replaceElement } from "./replaceElement";
import { DataWrapperEmbed } from "../../DataWrapperEmbed";
import { cn } from "@/lib/util/css";

const datavizEmbedUrlPattern = /interactive\.pri\.org/;

export const replaceDatavizEmbed: ReplaceCallback = replaceElement(
  ["div", "figure", "iframe"],
  (el, _index, options) => {
    const iframeElement = findDescendant(
      el,
      (n) =>
        n.name === "iframe" && datavizEmbedUrlPattern.test(n.attribs.src) && n,
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
        className="grid gap-y-4"
        {...(!isFloated && { "data-align": alignment })}
        {...(isFloated && { "data-floated": alignment })}
      >
        <DataWrapperEmbed
          className="rounded-md overflow-clip bg-current/40 backdrop-blur-md backdrop-brightness-125 p-6"
          src={src}
          height={height}
          iframeProps={iframeProps}
          title={title}
        />
        {!!captionChildren?.length && (
          <figcaption
            data-slot="embed-caption"
            {...captionProps}
            className={cn(
              "flex flex-col gap-y-2 font-light text-sm/tight px-2",
              captionClassName,
            )}
          />
        )}
      </figure>
    );
  },
);
