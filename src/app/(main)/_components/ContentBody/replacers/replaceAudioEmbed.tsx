import { type DOMNode, domToReact } from "html-react-parser";
import type { ReplaceCallback } from "@/components/HtmlContent/types";
import AudioPlayer from "@/app/(main)/_components/AudioPlayer";
import { findDescendant, getElementAlignment } from "@/lib/dom";
import { replaceElement } from "./replaceElement";
import { cn } from "@/lib/utils";

export const replaceAudioEmbed: ReplaceCallback = replaceElement(
  ["audio", "figure"],
  (el, _index, options) => {
    const { name, attribs } = el;
    let src: string | undefined;

    if (name === "audio") {
      src = attribs.src;
    }

    if (name === "figure" && !!attribs.class?.includes("wp-block-audio")) {
      const audioElement = findDescendant(el, (n) => n.name === "audio" && n);
      src = audioElement?.attribs.src;
    }

    if (!src) {
      // biome-ignore lint/complexity/noUselessFragments: See docs: https://github.com/remarkablemark/html-react-parser?tab=readme-ov-file#replace-and-remove-element
      return <></>;
    }

    const { alignment, isFloated } = getElementAlignment(el);
    const figcaptionElement = findDescendant(
      el,
      (node) => node.name === "figcaption" && node,
    );
    const figCaptionChildren =
      (figcaptionElement?.childNodes as DOMNode[]) || null;

    return (
      <figure
        data-slot="audio"
        className={cn("flex flex-col content-center gap-4", {
          "md:max-w-(--floated-max-w)": isFloated,
        })}
        {...(!isFloated && { "data-align": alignment })}
        {...(isFloated && { "data-floated": alignment })}
      >
        <AudioPlayer src={src} />
        {!!figCaptionChildren?.length && (
          <figcaption
            data-slot="audio-caption"
            className="px-2 font-light text-sm/tight"
          >
            {domToReact(figCaptionChildren, options)}
          </figcaption>
        )}
      </figure>
    );
  },
);
