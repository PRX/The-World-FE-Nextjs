import type { ReplaceCallback } from "@/components/HtmlContent/types";
import { replaceElement } from "./replaceElement";
import { cn } from "@/lib/utils";
import { attributesToProps } from "html-react-parser";
import Image from "next/image";

export const replaceScrollGallery: ReplaceCallback = replaceElement(
  ["div", "figure", "figcaption", "img"],
  (el) => {
    const { attribs, name } = el;

    if (!attribs.class?.includes("tw-scroll-gallery")) return;

    const classSet = new Set(attribs.class?.split(" "));
    const classMap = new Map<
      string,
      { [k: string]: string | string[] | { [k: string]: string } }
    >([
      [
        "tw-scroll-gallery",
        {
          style: {
            "--_screen-h": "100dvh",
            "--_slide--shift--start": "0",
            "--_slide--offset--start": "var(--_screen-h)",
            "--_slide--content--min-h": "var(--_screen-h)",
            "--_slide--offset--end": "0",
          },
          class: cn(
            "group/scroll-gallery",
            "relative clear-both my-12 @xs/body-root:w-[calc(100cqw+((var(--body-gutter)+var(--body-margin))*2))] left-1/2 -translate-x-1/2 overflow-clip",
            "group-data-menu-open/ui:rounded-l-xl",
            // Slide Transition.
            "data-[transition=slide]:*:not-first:[--_slide--shift--start:calc(var(--_screen-h)*-1)]",
            "data-[transition=slide]:*:not-last:[--_slide--offset--end:var(--_screen-h)]",
            // Fade Transition.
            "data-[transition=fade]:*:not-first:[--_slide--shift--start:calc(var(--_screen-h)*-2)]",
            "data-[transition=fade]:*:[--_slide--content--min-h:calc(var(--_screen-h)*2)]",
          ),
        },
      ],
      [
        "tw-scroll-gallery-slide",
        {
          class: cn(
            "group/slide",
            "relative isolate grid grid-rows-[var(--_slide--offset--start)_minmax(min-content,var(--_slide--content--min-h))_var(--_slide--offset--end)] w-full mt-(--_slide--shift--start)",
            "*:col-start-1 *:-col-end-1",
          ),
        },
      ],
      [
        "tw-scroll-gallery-slide--media",
        {
          class: cn("row-start-1 sticky top-0 w-full h-dvh object-cover"),
        },
      ],
      [
        "tw-scroll-gallery-slide--content",
        {
          class: cn(
            "row-start-2 row-span-1 isolate content-end z-1 min-h-(--_screen-h) p-12 text-white text-shadow-sm text-shadow-black/40",
            "*:w-4xl *:max-w-full",
            "[&_a]:text-orange",
            "group-data-[content-position=right]/slide:*:ms-auto",
            "group-data-[transition=fade]/scroll-gallery:sticky group-data-[transition=fade]/scroll-gallery:bottom-0",
          ),
        },
      ],
    ]);

    classMap.forEach((attrs, sgClass) => {
      if (!classSet.has(sgClass)) return;

      const newAttribs = Object.entries(attrs)
        .map(([k, v]) => {
          // Convert style object to string.
          if (typeof v !== "string" && !Array.isArray(v)) {
            return [
              k,
              Object.entries(v)
                .map((kv) => kv.join(":"))
                .join(";"),
            ];
          }
          // Convert class array to string.
          if (Array.isArray(v)) {
            return [k, v.join(" ")];
          }
          return [k, v];
        })
        .reduce(
          (a, [k, v]) => {
            a[k] = v;
            return a;
          },
          {} as { [k: string]: string },
        );

      el.attribs = {
        ...el.attribs,
        ...newAttribs,
      };
    });

    if (name === "img") {
      const { src, alt, ...imgAttribs } = el.attribs;
      const imgProps = attributesToProps(imgAttribs);
      const { className: imgClassName, ...imgPropsRest } = imgProps;

      return (
        <>
          <Image
            src={src}
            alt={alt}
            className={cn(
              "group-data-[transition=fade]/scroll-gallery:group-not-first/slide:opacity-0",
              "group-data-[transition=fade]/scroll-gallery:group-not-first/slide:animate-scroll-fade",
              "group-data-[transition=fade]/scroll-gallery:group-not-first/slide:[animation-timeline:view()]",
              "group-data-[transition=fade]/scroll-gallery:group-not-first/slide:[animation-range-start:var(--_screen-h)]",
              "group-data-[transition=fade]/scroll-gallery:group-not-first/slide:[animation-range-end:calc(var(--_screen-h)*2)]",
              imgClassName,
            )}
            {...imgPropsRest}
          />
          <div className={cn("row-start-2 relative")}>
            <div
              className={cn(
                "sticky top-0 h-(--_screen-h) bg-linear-to-t from-blue/60 to-blue/0 to-30%",
                "after:absolute after:inset-0 after:bg-linear-to-tr after:from-purple/60 after:to-purple/0 after:to-50%",
                "before:absolute before:inset-0 before:bg-linear-to-tl before:from-green/60 before:to-green/0 before:to-50%",
              )}
            />
          </div>
        </>
      );
    }
  },
);
