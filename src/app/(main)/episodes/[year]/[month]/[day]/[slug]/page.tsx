import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import ContentBody from "@/app/(main)/_components/ContentBody";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { Plausible, type PlausibleEventArgs } from "@/components/Plausible";
import { EpisodeIdType, type Post } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlEpisode } from "@/lib/fetch";
import { parseDateParts } from "@/lib/parse/date";
import { cn } from "@/lib/utils";
import CardCarousel from "@/app/(main)/_components/CardCarousel";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { generateContentLinkHref } from "@/lib/routing/content";
import {
  AddAudioButton,
  PlayAudioButton,
  type PlayerAudio,
} from "@/components/Player";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardImage,
  CardLink,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/parse/time";

type Props = {
  params: Promise<{ slug: string }>;
};

export const getCachedEpisode = unstable_cache(
  async (slug) => fetchGqlEpisode(slug, EpisodeIdType.Slug),
  ["episode"],
  {
    tags: ["episodes", "content"],
    revalidate: 60,
  },
);

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;

  // fetch post information
  const data = await getCachedEpisode(slug);

  if (!data) {
    return notFound();
  }

  const { seo, date, episodeDates } = data;
  const { broadcastDate } = episodeDates || {};

  // console.log(seo);

  return {
    ...seo, // TODO: Create util to convert seo data to Nextjs Metadata.
    ...((broadcastDate || date) && {
      pubdate: broadcastDate || date,
    }),
  };
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const data = await getCachedEpisode(slug);

  if (!data) {
    return notFound();
  }

  const {
    id,
    date,
    title,
    content,
    resourceDevelopmentTags,
    episodeAudio,
    episodeDates,
  } = data;
  const { audio } = episodeAudio || {};
  const { audioFields } = audio || {};
  const { segmentsList } = audioFields || {};
  const { broadcastDate } = episodeDates || {};
  const props = {
    Title: title,
    ...(!!resourceDevelopmentTags?.nodes.length && {
      "Resource Development": resourceDevelopmentTags.nodes[0].name,
    }),
    ...(broadcastDate &&
      (() => {
        const dt = parseDateParts(broadcastDate);
        return {
          "Broadcast Year": dt[0],
          "Broadcast Month": dt.slice(0, 2).join("-"),
          "Broadcast Date": dt.join("-"),
        };
      })()),
    ...(date &&
      (() => {
        const dt = parseDateParts(date);
        return {
          "Published Year": dt[0],
          "Published Month": dt.slice(0, 2).join("-"),
          "Published Date": dt.join("-"),
        };
      })()),
  };
  const plausibleEvents = [["Segment", { props }] as PlausibleEventArgs];

  const shownContentEndMessage = await getCtaRegionMessages(
    "content-inline-end",
    {
      ...(id && { id }),
    },
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="group/episode">
      <Plausible events={plausibleEvents} key={id} />
      <div className="relative ps-(--gutter-left)">
        <ContentBody html={content}>
          {/* Segments Carousel */}
          {!!segmentsList?.length && (
            <div className={cn("max-sm:snap-always max-sm:snap-center")}>
              <h2
                className={cn(
                  "ps-2 font-bold text-body-foreground text-2xl text-pretty",
                )}
              >
                In This Episode
              </h2>
              <div className={cn("mt-2")}>
                <CardCarousel
                  opts={{
                    align: "start",
                    slidesToScroll: 1,
                    skipSnaps: true,
                    breakpoints: {
                      "(max-width: 768px)": { align: "center" },
                    },
                  }}
                  className={cn(
                    "relative w-dvw -translate-x-[calc(var(--gutter-left)+(var(--body-gutter)*2))]",
                    "group-data-[color-scheme=dark]/body:[--card:hsl(from_var(--color-navy-blue)_h_s_calc(l*1.5))]",
                    // "group-data-menu-open/ui:mask-[linear-gradient(to_right,transparent_calc(var(--gutter-left)-var(--body-gutter)),black_calc(var(--gutter-left)+var(--body-gutter)))]",
                  )}
                >
                  <CarouselPrevious className="pl-(--gutter-left) from-[calc(var(--gutter-left))] max-md:hidden" />
                  <CarouselContent className="px-[calc(var(--gutter-left)+(var(--body-gutter)*2))] justify-between">
                    {segmentsList.map((segment) => {
                      if (!segment) return null;

                      const { segmentContent } = segment;
                      const { audio: segmentAudio } = segmentContent || {};
                      const { duration: segmentAudioDuration, parent } =
                        segmentAudio || {};
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
                          className="basis-[calc(min(280px,80dvw))] grid max-lg:snap-always max-lg:snap-center"
                          key={id}
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
                            {!!segmentAudio && (
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
                                      audio={segmentAudio}
                                      fallbackProps={segmentAudioProps}
                                    />
                                    {segmentAudioDuration && (
                                      <span>
                                        {formatDuration(segmentAudioDuration)}
                                      </span>
                                    )}
                                  </span>
                                  <AddAudioButton
                                    className="text-cyan"
                                    variant="ghost"
                                    audio={segmentAudio}
                                    fallbackProps={segmentAudioProps}
                                  />
                                </div>
                              </CardFooter>
                            )}
                          </Card>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselNext className="max-md:hidden" />
                </CardCarousel>
              </div>
            </div>
          )}

          {shownContentEndMessage && (
            <div className="px-4">
              <CtaRegion cta={shownContentEndMessage} />
            </div>
          )}
        </ContentBody>
      </div>
    </div>
  );
}
