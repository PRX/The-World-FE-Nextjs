"use client";

import type {
  Post,
  PostStory,
  ProgramToEpisodeConnection,
  Segment,
} from "@/interfaces";
import { useState } from "react";
import WheelGestures from "embla-carousel-wheel-gestures";
import HeroImageBackground from "@/app/(main)/_components/HeroImageBackground";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { HtmlContent } from "@/components/HtmlContent";
import { DateTime } from "@/components/DateTime";
import { ListPlusIcon, PlayIcon } from "lucide-react";
import { generateContentLinkHref } from "@/lib/routing";
import Link from "next/link";
import { formatDuration } from "@/lib/parse/time";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export type HeroEpisodesCarouselProps = React.ComponentProps<
  React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >
> & {
  episodes: ProgramToEpisodeConnection;
};

export default function HeroEpisodesCarousel({
  className,
  episodes,
  ...rest
}: HeroEpisodesCarouselProps) {
  const { nodes } = episodes;
  const [currentIndex, setCurrentIndex] = useState(0);
  const episode = nodes[currentIndex];
  const {
    id: episodeId,
    title,
    link,
    date,
    episodeDates,
    featuredImage,
    excerpt,
    teaserFields,
    episodeAudio,
  } = episode;
  const { broadcastDate } = episodeDates || {};
  const { node: image } = featuredImage || {};
  const { teaser } = teaserFields || {};
  const { audio } = episodeAudio || {};
  const { audioFields, duration } = audio || {};
  const { segmentsList } = audioFields || {};
  const linkHref = generateContentLinkHref(link);
  const hasExcerpt = !!excerpt?.trim();
  const hasTeaser = !!teaser?.trim();
  const hasAudio = !!audio;

  return (
    <div
      className={cn(
        "relative grid content-end max-w-full",
        "pt-[calc(var(--gutter-top)+var(--spacing)*4)] pl-[max(var(--gutter-left),var(--spacing)*28)] pr-(--gutter-right)",
        {
          "min-h-screen md:min-h-[calc(80svh+var(--gutter-top))] -mb-[25svh]":
            !!image,
        },
        className,
      )}
      {...rest}
    >
      {image && <HeroImageBackground data={image} />}
      <div className="relative grid gap-y-4 content-end pl-4">
        <div className="grid grid-cols-[min-content_1fr] items-end gap-8">
          {/* Full Episode Card */}
          <div
            className={cn(
              "relative grid content-end gap-y-2 size-140",
              "before:absolute before:inset-0 before:-z-1 before:bg-background/40 before:mask-t-from-0 before:rounded-sm before:opacity-0 before:backdrop-blur-sm before:backdrop-brightness-125",
              "hover:before:opacity-100 hover:before:scale-[104%] hover:before:transition-all",
            )}
          >
            {linkHref && (
              <Link href={linkHref} className="absolute inset-0"></Link>
            )}
            <h3 className="text-3xl font-bold text-pretty">{title}</h3>
            <div className="flex items-center gap-4">
              <span className="text-cyan font-serif font-bold italic uppercase">
                Full Episode
              </span>
              {!currentIndex && (
                <Badge variant="secondary" className="uppercase">
                  Latest
                </Badge>
              )}
              <DateTime
                date={broadcastDate || date}
                options={{ year: "numeric", month: "short", day: "numeric" }}
              />
            </div>
            {hasTeaser ? (
              <HtmlContent html={`<p>${teaser}</p>`} className="text-xl" />
            ) : (
              hasExcerpt && (
                <HtmlContent html={excerpt} className="text-xl/snug" />
              )
            )}
            {hasAudio && (
              <div className="flex justify-between items-center p-2 bg-navy-blue/80 bg-linear-to-l from-purple backdrop-blur-sm border border-purple rounded-sm leading-1">
                <span className="flex items-center gap-x-2">
                  <PlayIcon className="text-cyan" />
                  {duration && <span>{formatDuration(duration)}</span>}
                </span>
                <ListPlusIcon />
              </div>
            )}
          </div>
          {/* Segments Carousel */}
          {!!segmentsList?.length && (
            <div className="flex flex-col justify-items-start gap-y-2 overflow-hidden pb-1 -mb-1">
              <h2 className="text-cyan font-serif font-bold italic uppercase">
                In This Episode&hellip;
              </h2>
              <Carousel
                opts={{ align: "start", slidesToScroll: 1, skipSnaps: true }}
                plugins={[WheelGestures()]}
                key={episodeId}
              >
                <CarouselContent>
                  {segmentsList?.map((segment) => {
                    if (!segment) return null;

                    const { segmentContent } = segment;
                    const { audio } = segmentContent || {};
                    const { duration, parent } = audio || {};
                    const isParentAStory =
                      parent?.node.contentTypeName === "post";
                    const {
                      id,
                      title,
                      link: segmentLink,
                      featuredImage,
                    } = (isParentAStory && (parent?.node as Post)) ||
                    segment ||
                    {};
                    const { altText, sourceUrl, mediaItemUrl } =
                      featuredImage?.node || {};
                    const imageSrc = sourceUrl || mediaItemUrl;
                    const linkHref = generateContentLinkHref(segmentLink);

                    return (
                      <CarouselItem
                        className="group/carousel-item basis-[calc(min(280px,80dvw))] grid"
                        key={id}
                      >
                        <Card className={cn("aspect-260/360")}>
                          {imageSrc && (
                            <CardImage>
                              <Image
                                src={imageSrc}
                                alt={altText || ""}
                                fill
                                objectFit="cover"
                              />
                            </CardImage>
                          )}
                          <CardHeader>
                            <CardTitle>{title}</CardTitle>
                            {isParentAStory && (
                              <CardAction>
                                <Badge variant="secondary">
                                  Special Coverage
                                </Badge>
                              </CardAction>
                            )}
                          </CardHeader>
                          {audio && (
                            <CardFooter>
                              <div
                                className={cn(
                                  "relative z-1 flex justify-between items-center leading-1 [&_svg]:text-cyan",
                                )}
                              >
                                <span className="flex items-center gap-x-2">
                                  <PlayIcon />
                                  {duration && (
                                    <span>{formatDuration(duration)}</span>
                                  )}
                                </span>
                                <ListPlusIcon />
                              </div>
                            </CardFooter>
                          )}
                          {linkHref && (
                            <Link
                              href={linkHref}
                              className="absolute inset-0"
                            ></Link>
                          )}
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="rounded-s-sm" />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-center w-120">
          {nodes.map((e, i) => (
            <button
              type="button"
              className={cn(
                "size-4 rounded-full bg-background/30 hover:bg-secondary/80 backdrop-blur-sm backdrop-brightness-125 overflow-clip transition-[width] cursor-pointer",
                { "w-12 bg-cyan": i === currentIndex },
              )}
              onClick={((_i) => () => {
                setCurrentIndex(_i);
              })(i)}
              key={e.id}
              aria-label={`Preview "${title}"`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}
