import type { CSSProperties } from "react";
import type { City, Episode, Post, Segment } from "@/interfaces";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { isArray } from "lodash";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlCities, type CitiesQueryOptions } from "@/lib/fetch";
import { cn } from "@/lib/util/css";
import {
  Card,
  CardFooter,
  CardHeader,
  CardImage,
  CardLink,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateContentLinkHref } from "@/lib/routing/content";
import { BookmarkIcon, Building2Icon } from "lucide-react";
import CardCarousel from "@/app/(main)/_components/CardCarousel";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  AddAudioButton,
  PlayAudioButton,
  type PlayerAudio,
} from "@/components/Player";
import Link from "next/link";
import { DateTime } from "@/components/DateTime";
import { formatDuration } from "@/lib/parse/time";
import type { Metadata, ResolvingMetadata } from "next";
import { convertSeoToMetadata } from "@/lib/parse/seo";

export const getCachedCities = unstable_cache(
  async (query: CitiesQueryOptions) => fetchGqlCities(query),
  ["cities"],
  {
    tags: ["cities", "taxonomy"],
    revalidate: 3600,
  },
);

export async function generateMetadata(
  _props: Record<string, string>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const metadata = await parent.then((r) => r as Metadata);
  const seoTitle = "Cities";
  const link = "https://theworld.org/tags/cities";
  const md = {
    canonical: link,
    title: seoTitle,
    opengraphTitle: seoTitle,
    opengraphUrl: link,
    twitterTitle: seoTitle,
  };

  return convertSeoToMetadata(md, metadata) || {};
}

export default async function CitiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { search: searchParam } = resolvedSearchParams;
  const search = isArray(searchParam) ? searchParam.join(", ") : searchParam;
  const data = await getCachedCities({
    first: 20,
    where: {
      search,
    },
  });

  const { nodes } = data || {};

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-bottom",
  ).then((messages) => getShownMessage(messages));

  return (
    <main
      style={
        {
          "--_menu-width": "var(--gutter-left)",
          "--_gutter-left": "calc(var(--_menu-width) + (var(--spacing) * 10))",
        } as CSSProperties
      }
      className="grid gap-y-10 mt-10"
    >
      {nodes?.map((tag: City, carouselIndex) => {
        const { id, name, link, count, contentNodes, taxonomyImages } = tag;
        const countString = count?.toLocaleString(undefined, {
          notation: "compact",
        });
        const info = [
          count && (count > 1 ? `${countString} posts` : "1 post"),
        ].filter((v) => !!v);
        const { sourceUrl, mediaItemUrl, altText } =
          taxonomyImages?.logo?.node || {};
        const imageSrc = sourceUrl || mediaItemUrl;
        const href = generateContentLinkHref(link) || "";
        const slides = contentNodes?.nodes || [];

        return (
          <section
            className={cn(
              "group/contributor",
              "grid grid-cols-[0_1fr] md:grid-cols-[var(--_gutter-left)_1fr] justify-start -mb-1",
              "max-sm:snap-always max-sm:snap-center",
              "nth-of-type-[5n+1]:**:data-[slot=avatar]:bg-dark-green",
              "nth-of-type-[5n+2]:**:data-[slot=avatar]:bg-purple",
              "nth-of-type-[5n+3]:**:data-[slot=avatar]:bg-red",
              "nth-of-type-[5n+4]:**:data-[slot=avatar]:bg-burnt-orange",
              "nth-of-type-[5n+5]:**:data-[slot=avatar]:bg-navy-blue",
              "snap-always snap-center",
            )}
            key={id}
          >
            <header
              className={cn(
                "col-start-2 justify-self-start relative grid grid-cols-[min-content_1fr] gap-6 ml-4 p-4",
                "before:absolute before:inset-0 before:-z-1 before:bg-current/10 before:backdrop-blur-lg before:backdrop-brightness-115 before:rounded-md before:opacity-0 before:transition-opacity",
                "hover:before:opacity-100",
              )}
            >
              <div className="grid aspect-square">
                <Avatar
                  className={cn("relative size-20 ring-6 ring-current/20")}
                >
                  {imageSrc && (
                    <AvatarImage
                      src={imageSrc}
                      sizes="400px"
                      alt={altText || name || ""}
                    />
                  )}
                  <AvatarFallback>
                    <Building2Icon className="size-10" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <h2 className="text-xl font-semibold capitalize">{name}</h2>
                {!!info.length && (
                  <div className="text-sm/none font-light [&>*+*]:before:content-['\2022'] [&>*+*]:before:mx-1">
                    {info.map((v) => (
                      <span key={v}>{v}</span>
                    ))}
                  </div>
                )}
              </div>
              {!!href && (
                <CardLink href={href} aria-label={name ?? undefined} />
              )}
            </header>
            <div className="row-start-2 col-span-2 overflow-hidden">
              <CardCarousel
                opts={{
                  active: false,
                  align: "start",
                  slidesToScroll: 1,
                  skipSnaps: true,
                  breakpoints: {
                    "(pointer: fine)": { active: true },
                  },
                }}
                className="**:data-[slot=carousel-content]:pointer-coarse:overflow-x-auto **:data-[slot=carousel-content]:snap-proximity **:data-[slot=carousel-content]:snap-x"
              >
                <CarouselPrevious className="w-auto opacity-100 pl-(--_gutter-left) pointer-coarse:hidden" />
                <CarouselContent className="">
                  {slides.map((node, index, all) => {
                    if (!node) return null;

                    const { additionalMedia, primaryCategory } = node as Post;
                    const { episodeAudio } = node as Episode;
                    const { segmentContent } = node as Segment;

                    const { audio } =
                      additionalMedia || episodeAudio || segmentContent || {};
                    const { duration, parent } = audio?.node || {};
                    const isParentOfSegmentAudioAStory =
                      !!segmentContent &&
                      parent?.node.contentTypeName === "post";
                    const isEpisode = !!episodeAudio;

                    const isParentPostInSlides =
                      isParentOfSegmentAudioAStory &&
                      all.find((n) => n.id === parent.node.id);

                    if (isParentPostInSlides) return null;

                    const slideNode =
                      (isParentOfSegmentAudioAStory &&
                        (parent?.node as Post)) ||
                      (node as Post);
                    const { id, title, date, link, featuredImage } =
                      slideNode || {};

                    const { name: pcName, link: pcLink } =
                      primaryCategory || {};
                    const {
                      id: imageId,
                      altText,
                      sourceUrl,
                      mediaItemUrl,
                    } = featuredImage?.node || {};
                    const isPlaceholderImage =
                      !!imageId && ["cG9zdDo5Ng=="].includes(imageId);
                    const imageSrc = sourceUrl || mediaItemUrl;
                    const linkHref = generateContentLinkHref(link);
                    const pcLinkHref = generateContentLinkHref(pcLink);
                    const fallbackProps = {
                      title,
                      queuedFrom: "Card Controls",
                      ...(imageSrc && { imageUrl: imageSrc }),
                      linkResource: slideNode,
                    } as Partial<PlayerAudio>;

                    return (
                      <CarouselItem
                        className={cn(
                          "grid aspect-300/480 basis-[calc(min(300px,80dvw))] h-120 transition-all",
                          "nth-of-type-[1]:aspect-square nth-of-type-[1]:basis-[calc(min(480px,80dvw))]",
                          "md:nth-of-type-[1]:ml-[calc(var(--_gutter-left)+var(--spacing)*2)]",
                          "snap-always snap-center",
                        )}
                        key={id}
                      >
                        <Card className={cn("")}>
                          {linkHref && (
                            <CardLink
                              href={linkHref}
                              aria-label={title ?? undefined}
                            />
                          )}
                          {imageSrc && !isPlaceholderImage && (
                            <CardImage data-image-id={imageId}>
                              <Image
                                src={imageSrc}
                                alt={altText || ""}
                                fill
                                sizes={`(min-width: 768px) ${index === 0 ? "1440px" : "900px"}, 240vw`}
                                style={{
                                  objectFit: "cover",
                                }}
                                loading={carouselIndex === 0 ? "eager" : "lazy"}
                                {...(carouselIndex === 0 && {
                                  preload: true,
                                })}
                              />
                            </CardImage>
                          )}
                          <CardHeader>
                            {pcLinkHref && (
                              <Link
                                href={pcLinkHref}
                                className={cn(
                                  "relative z-2 flex self-start items-center gap-x-2 py-1 pl-1 pr-2 -ml-1 rounded-sm text-md/tight text-balance [&>svg]:text-cyan",
                                  "hover:bg-cyan/10 hover:backdrop-blur-md hover:backdrop-brightness-125",
                                )}
                              >
                                <BookmarkIcon /> {pcName}
                              </Link>
                            )}
                            <CardTitle>{title}</CardTitle>
                            <div className="flex items-center text-md [&>*+*]:before:content-['\2022'] [&>*+*]:before:mx-2">
                              {isEpisode && (
                                <span className="text-cyan font-bold font-serif uppercase italic">
                                  Full Episode
                                </span>
                              )}
                              <DateTime
                                date={date}
                                options={{
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }}
                              />
                            </div>
                          </CardHeader>
                          {audio?.node && (
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
                                    audio={audio.node}
                                    fallbackProps={fallbackProps}
                                  />
                                  {duration && (
                                    <span>{formatDuration(duration)}</span>
                                  )}
                                </span>
                                <AddAudioButton
                                  className="text-cyan"
                                  variant="ghost"
                                  audio={audio.node}
                                  fallbackProps={fallbackProps}
                                />
                              </div>
                            </CardFooter>
                          )}
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselNext className="pointer-coarse:hidden" />
              </CardCarousel>
            </div>
          </section>
        );
      })}

      {shownContentEndMessage && (
        <div className="px-4 mt-20 md:ml-(--_gutter-left)">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </main>
  );
}
