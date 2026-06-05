"use client";

import type { Post, ProgramToEpisodeConnection, Segment } from "@/interfaces";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WheelGestures from "embla-carousel-wheel-gestures";
import { AnimatePresence, motion, stagger } from "motion/react";
import HeroImageBackground from "@/app/(main)/_components/HeroImageBackground";
import { cn } from "@/lib/util/css";
import { Badge } from "@/components/ui/badge";
import { HtmlContent } from "@/components/HtmlContent";
import { DateTime } from "@/components/DateTime";
import { generateContentLinkHref } from "@/lib/routing";
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
  CardFooter,
  CardHeader,
  CardImage,
  CardLink,
  CardTitle,
} from "@/components/ui/card";
import {
  AddAudioButton,
  PlayAudioButton,
  type PlayerAudio,
} from "@/components/Player";
import AudioBar from "../AudioBar";

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
  const scrollWrapper = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInit, setIsInit] = useState(true);
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
  const { sourceUrl, mediaItemUrl } = image || {};
  const imageSrc = sourceUrl || mediaItemUrl;
  const { teaser } = teaserFields || {};
  const { audio } = episodeAudio || {};
  const { audioFields } = audio?.node || {};
  const { segmentsList } = audioFields || {};
  const linkHref = generateContentLinkHref(link);
  const hasExcerpt = !!excerpt?.trim();
  const hasTeaser = !!teaser?.trim();
  const hasAudio = !!audio?.node;
  const audioProps = {
    title,
    queuedFrom: "Card Controls (Hero Episodes Carousel)",
    ...(imageSrc && { imageUrl: imageSrc }),
    linkResource: episode,
  } as Partial<PlayerAudio>;

  return (
    <div
      className={cn(
        "relative grid content-end max-w-full",
        "pt-[calc(var(--gutter-top)+var(--spacing)*4)] pr-(--gutter-right)",
        {
          "min-h-[calc(80svh+var(--gutter-top))]": !!image,
        },
        className,
      )}
      {...rest}
    >
      {image && <HeroImageBackground data={image} />}
      <div className="relative grid gap-y-2 content-end">
        <div
          ref={scrollWrapper}
          className={cn(
            "grid grid-cols-[min-content_1fr] items-end p-4 pr-0",
            "md:pl-(--_gutter-left) md:mask-[linear-gradient(90deg,transparent_calc(var(--_menu-width)/1.5),black_var(--_gutter-left))] lg:mask-none",
            "max-lg:overflow-x-auto max-lg:gap-4 max-lg:snap-mandatory max-lg:snap-x max-lg:scroll-pl-(--_gutter-left) max-sm:scroll-pl-4 no-scrollbar",
          )}
        >
          {/* Full Episode Card */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={episodeId}
              variants={{
                hidden: {
                  opacity: 0,
                },
                initial: { opacity: 0, x: 0 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, delay: 0.25 },
                },
              }}
              initial={isInit ? "visible" : "initial"}
              animate="visible"
              exit="hidden"
              className={cn(
                "relative grid content-end gap-y-3 w-[clamp(300px,40vw,560px)] max-w-[min(var(--spacing)*140,80vw)]",
                "before:absolute before:inset-0 before:-z-1 before:bg-cyan/40 before:mask-t-from-0 before:rounded-sm before:opacity-0 before:backdrop-blur-lg before:backdrop-brightness-125",
                "hover:before:opacity-100 hover:before:scale-[104%] hover:before:transition-all",
                "focus-within:before:opacity-100 focus-within:before:scale-[104%] focus-within:before:transition-all",
                "max-lg:snap-always max-lg:snap-start",
              )}
            >
              {linkHref && (
                <Link
                  href={linkHref}
                  className="absolute inset-0 focus-visible:outline-none"
                ></Link>
              )}
              <h3 className="text-[clamp(2rem,6vw,3rem)] leading-none font-bold text-balance">
                {title}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4">
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
                <HtmlContent
                  html={`<p>${teaser}</p>`}
                  className="text-xl/snug"
                />
              ) : (
                hasExcerpt && (
                  <HtmlContent
                    html={excerpt}
                    className="text-xl/snug max-sm:hidden"
                  />
                )
              )}
              {hasAudio && (
                <AudioBar audio={audio.node} fallbackProps={audioProps} />
              )}
            </motion.div>
          </AnimatePresence>
          {/* Segments Carousel */}
          {!!segmentsList?.nodes?.length && (
            <div
              className={cn(
                "grid grid-cols-[0_max-content] align-items-start gap-y-2 -mb-1",
                "lg:overflow-hidden lg:grid-cols-[--spacing(8)_1fr] lg:mask-[linear-gradient(90deg,transparent_--spacing(2),black_--spacing(8))]",
              )}
            >
              <h2 className="col-start-2 sticky left-4 justify-self-start text-cyan font-serif font-bold italic uppercase ml-2">
                In This Episode&hellip;
              </h2>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={episodeId}
                  className="row-start-2 col-span-2"
                  variants={{
                    hidden: {
                      opacity: 0,
                      transition: {
                        delayChildren: stagger(0.1),
                      },
                    },
                    visible: {
                      x: 0,
                      opacity: 1,
                      transition: {
                        duration: 0.5,
                        delay: 0.25,
                        delayChildren: stagger(0.1),
                      },
                    },
                  }}
                  initial={isInit ? "visible" : "hidden"}
                  animate="visible"
                  exit="hidden"
                >
                  <Carousel
                    opts={{
                      active: false,
                      align: "start",
                      slidesToScroll: 1,
                      skipSnaps: true,
                      breakpoints: {
                        "(min-width: 1024px) and (pointer: fine)": {
                          active: true,
                        },
                      },
                    }}
                    plugins={[WheelGestures()]}
                    key={episodeId}
                    className={cn(
                      "**:data-[slot=carousel-content]:overflow-visible",
                      "**:data-[slot=carousel-content]:lg:pointer-coarse:overflow-x-auto **:data-[slot=carousel-content]:lg:pointer-coarse:snap-proximity **:data-[slot=carousel-content]:lg:pointer-coarse:snap-x **:data-[slot=carousel-content]:lg:pointer-coarse:scroll-pl-8",
                    )}
                  >
                    <CarouselPrevious className="rounded-s-sm pointer-coarse:hidden" />
                    <CarouselContent>
                      {(segmentsList.nodes as Segment[]).map((segment) => {
                        if (!segment) return null;

                        const { segmentContent } = segment;
                        const { audio: segmentAudio } = segmentContent || {};
                        const { duration: segmentAudioDuration, parent } =
                          segmentAudio?.node || {};
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
                        const segmentImageSrc = sourceUrl || mediaItemUrl;
                        const segmentLinkHref =
                          generateContentLinkHref(segmentLink);
                        const segmentAudioProps = {
                          title,
                          queuedFrom: "Card Controls (Hero Episodes Carousel)",
                          ...(segmentImageSrc && { imageUrl: segmentImageSrc }),
                          linkResource: parent?.node || segment,
                        } as Partial<PlayerAudio>;

                        return (
                          <CarouselItem
                            className={cn(
                              "basis-[calc(min(280px,80dvw))] grid snap-always snap-center lg:snap-start",
                              "first:lg:ml-8",
                            )}
                            key={id}
                          >
                            <motion.div
                              variants={{
                                hidden: {
                                  opacity: 0,
                                  scale: 0.9,
                                },
                                visible: {
                                  opacity: 1,
                                  scale: 1,
                                  transition: { delay: 0.5 },
                                },
                              }}
                            >
                              <Card className={cn("aspect-260/360")}>
                                {segmentLinkHref && (
                                  <CardLink href={segmentLinkHref} />
                                )}
                                {segmentImageSrc && (
                                  <CardImage>
                                    <Image
                                      src={segmentImageSrc}
                                      alt={altText || ""}
                                      fill
                                      sizes="(min-width: 768px) 840px, 240vw"
                                      style={{
                                        objectFit: "cover",
                                      }}
                                      loading="eager"
                                      preload
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
                                {!!segmentAudio?.node && (
                                  <CardFooter>
                                    <div
                                      className={cn(
                                        "relative z-1 flex justify-between items-center leading-1",
                                      )}
                                    >
                                      <span className="flex items-center gap-x-2">
                                        <PlayAudioButton
                                          className="text-cyan"
                                          variant="ghost"
                                          audio={segmentAudio.node}
                                          fallbackProps={segmentAudioProps}
                                        />
                                        {segmentAudioDuration && (
                                          <span>
                                            {formatDuration(
                                              segmentAudioDuration,
                                            )}
                                          </span>
                                        )}
                                      </span>
                                      <AddAudioButton
                                        className="text-cyan"
                                        variant="ghost"
                                        audio={segmentAudio.node}
                                        fallbackProps={segmentAudioProps}
                                      />
                                    </div>
                                  </CardFooter>
                                )}
                              </Card>
                            </motion.div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselNext className="pointer-coarse:hidden" />
                  </Carousel>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-center md:w-[clamp(300px,40vw,560px)]  md:ml-(--_gutter-left)">
          {nodes.map((e, i) => (
            <button
              type="button"
              className={cn(
                "size-4 rounded-full bg-background/30 hover:bg-secondary/80 backdrop-blur-sm backdrop-brightness-125 overflow-clip transition-[width] cursor-pointer",
                { "w-12 bg-cyan": i === currentIndex },
              )}
              onClick={((ni) => () => {
                setIsInit(false);
                setCurrentIndex(ni);
                if (scrollWrapper.current) {
                  scrollWrapper.current.scrollLeft = 0;
                }
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
