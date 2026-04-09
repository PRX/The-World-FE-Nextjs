import type { Maybe, MediaItem } from "@/interfaces";
import Link from "next/link";
import ImageViewer from "@/app/(main)/_components/ImageViewer";
import { cn } from "@/lib/util/css";
import { HtmlContent } from "@/components/HtmlContent";
import HeroImageBackground from "../HeroImageBackground";

export default function HeroHeader({
  className,
  children,
  image,
  classes,
  fullWidth,
  ...rest
}: React.ComponentProps<
  React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >
> & {
  image?: Maybe<MediaItem>;
  classes?: Partial<Record<"content", string>>;
  fullWidth?: boolean;
}) {
  const { caption, imageFields, sourceUrl, mediaItemUrl, mediaDetails } =
    image || {};
  const { mediaCredit, mediaCreditUrl } = imageFields || {};
  const imageUrl = sourceUrl || mediaItemUrl;
  const { width, height } = mediaDetails || {};
  const hasCaption = !!caption?.length;
  const hasCredit = !!mediaCredit?.length;
  const hasImageInfo = hasCaption || hasCredit;

  return (
    <div
      className={cn(
        "relative grid justify-stretch content-end",
        "pl-(--gutter-left) pr-(--gutter-right)",
        {
          "pt-[calc(var(--gutter-top)+4rem)]": !image,
          "min-h-screen md:min-h-[calc(90vh+var(--gutter-top))] pt-[calc(var(--gutter-top)+40dvh)] pb-[25svh] -mb-[25svh]":
            !!image,
        },
        className,
      )}
      {...rest}
    >
      {image && <HeroImageBackground data={image} />}
      <div
        className={cn(
          "@container/hero-content",
          "group/hero-content grid gap-4 content-end w-full p-4 md:px-8",
          {
            "max-w-250 mx-auto": !fullWidth,
          },
          classes?.content,
        )}
      >
        {children}
        {image && hasImageInfo && (
          <div className="grid grid-cols-[max-content_1fr] gap-4 justify-between items-start">
            {imageUrl && (
              <ImageViewer
                imageUrl={imageUrl}
                altText={image.altText || ""}
                width={width}
                height={height}
              />
            )}
            <div className="flex flex-wrap justify-between items-center gap-2 min-h-7.5">
              {hasCaption && (
                <span className="font-light text-xs/tight text-pretty">
                  <HtmlContent html={caption} />
                </span>
              )}
              {hasCredit && (
                <span className="text-xs/tight font-light whitespace-nowrap">
                  {mediaCreditUrl ? (
                    <Link href={mediaCreditUrl}>
                      <HtmlContent html={mediaCredit} />
                    </Link>
                  ) : (
                    <HtmlContent html={mediaCredit} />
                  )}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
