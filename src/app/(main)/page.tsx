import cn from "@/lib/util/css/cn";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { fetchGqlHomepage } from "@/lib/fetch";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardFooter,
  CardHeader,
  CardImage,
  CardLink,
  CardTitle,
} from "@/components/ui/card";
import type { Category, Post } from "@/interfaces";
import { generateContentLinkHref } from "@/lib/routing/content";
import { BookmarkIcon, ListPlusIcon, PlayIcon } from "lucide-react";
import { formatDuration } from "@/lib/parse/time";
import CardCarousel from "./_components/CardCarousel";
import { DateTime } from "@/components/DateTime";
import Link from "next/link";
import { parseMenu } from "@/lib/parse/menu";
import { Button } from "@/components/ui/button";

export const getCachedHomepage = unstable_cache(
  async () => fetchGqlHomepage(),
  ["homepage"],
  {
    tags: ["homepage", "content"],
    revalidate: 60,
  },
);

export default async function Home() {
  const data = await getCachedHomepage();

  if (!data) return null;

  const { id, programContributors, posts, landingPage, menus } = data;
  const { team } = programContributors || {};
  const { quickLinks } = menus;
  const quickLinksMenu = parseMenu(quickLinks);
  const carouselsData = quickLinks.map(({ label, url, connectedNode }) => {
    const category = connectedNode?.node as Category;
    const categoryLinkHref = generateContentLinkHref(url);
    return {
      key: category.id,
      header: (
        <>
          {categoryLinkHref && (
            <Link className="flex items-center gap-x-2" href={categoryLinkHref}>
              <BookmarkIcon /> {label}
            </Link>
          )}
        </>
      ),
      featuredPostsNodes: (category.landingPage?.featuredPosts || []) as Post[],
      postsNodes: category.posts?.nodes as Post[],
    };
  });
  const { featuredPosts } = landingPage || {};
  const postsNodes = (posts?.nodes || []) as Post[];
  const featuredPostsNodes = (featuredPosts || []) as Post[];

  // Prepend Latest Headlines carousel config.
  carouselsData.unshift({
    key: id,
    header: <>Latest Headlines</>,
    featuredPostsNodes,
    postsNodes,
  });

  return (
    <div className="grid gap-y-8 mt-12">
      {/* Quick Links Menu */}
      <div className="sticky top-(--gutter-top) z-2 overflow-hidden">
        <CardCarousel>
          <CarouselPrevious className="w-auto opacity-100 pl-[calc(max(var(--gutter-left),var(--spacing)*28)+var(--spacing)*4)] [&>svg]:size-8" />
          <CarouselContent>
            {quickLinksMenu.map(({ key, label, url }) => (
              <CarouselItem
                className={cn(
                  "basis-auto",
                  "md:nth-of-type-[1]:ml-[calc(max(var(--gutter-left),var(--spacing)*28)+var(--spacing)*4)]",
                )}
                key={key}
              >
                <Button asChild>
                  <Link href={url}>{label}</Link>
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="[&>svg]:size-8" />
        </CardCarousel>
      </div>

      <main className="grid gap-y-8">
        {/* Headlines Carousels */}
        {carouselsData.map(
          (
            { key, header, featuredPostsNodes: fpn, postsNodes: pn },
            carouselIndex,
          ) => {
            // Combine featured post with latest posts.
            const slides = [
              // Featured posts should be first.
              ...fpn,
              // Append latest posts, filtering out any duplicates with the featured posts.
              ...(pn.filter(({ id }) => !fpn.find((p) => p?.id === id)) || []),
            ]
              // Cap the number of slides for consistency.
              // May remove this since its affect amy not be noticeable.
              .slice(0, 20);
            return (
              <div
                className="grid grid-cols-[max(var(--gutter-left),var(--spacing)*28)_1fr] justify-start gap-y-2 -mb-1"
                key={key}
              >
                <h2 className="col-start-2 justify-self-start pl-4 font-bold text-2xl [&_svg:first-child]:size-8 [&_svg:first-child]:text-cyan">
                  {header}
                </h2>
                <div className="row-start-2 col-span-2 overflow-hidden">
                  <CardCarousel
                    opts={{
                      align: "start",
                      slidesToScroll: 1,
                      skipSnaps: true,
                    }}
                    className=""
                  >
                    <CarouselPrevious className="w-auto opacity-100 pl-[calc(max(var(--gutter-left),var(--spacing)*28))]" />
                    <CarouselContent className="">
                      {slides.map((post, index) => {
                        if (!post) return null;

                        const {
                          id,
                          title,
                          date,
                          link,
                          featuredImage,
                          additionalDates,
                          additionalMedia,
                          primaryCategory,
                        } = post;
                        const { broadcastDate } = additionalDates || {};
                        const { audio } = additionalMedia || {};
                        const { duration } = audio || {};
                        const { name: pcName, link: pcLink } =
                          primaryCategory || {};
                        const { altText, sourceUrl, mediaItemUrl } =
                          featuredImage?.node || {};
                        const imageSrc = sourceUrl || mediaItemUrl;
                        const linkHref = generateContentLinkHref(link);
                        const pcLinkHref = generateContentLinkHref(pcLink);

                        return (
                          <CarouselItem
                            className={cn(
                              "grid aspect-300/480 basis-[calc(min(300px,80dvw))] h-120 transition-all",
                              "nth-of-type-[1]:aspect-square nth-of-type-[1]:basis-[calc(min(480px,80dvw))]",
                              "md:nth-of-type-[1]:ml-[calc(max(var(--gutter-left),var(--spacing)*28)+var(--spacing)*2)]",
                            )}
                            key={id}
                          >
                            <Card className={cn("")}>
                              {linkHref && <CardLink href={linkHref} />}
                              {imageSrc && (
                                <CardImage>
                                  <Image
                                    src={imageSrc}
                                    alt={altText || ""}
                                    fill
                                    sizes={`(min-width: 768px) ${index === 0 ? "1440px" : "900px"}, 240vw`}
                                    style={{
                                      objectFit: "cover",
                                    }}
                                    loading={
                                      carouselIndex === 0 ? "eager" : "lazy"
                                    }
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
                                      "relative z-2 flex self-start items-center gap-x-2 py-1 pl-1 pr-2 -ml-1 rounded-sm text-md [&>svg]:text-cyan",
                                      "hover:bg-cyan/10 hover:backdrop-blur-md hover:backdrop-brightness-125",
                                    )}
                                  >
                                    <BookmarkIcon /> {pcName}
                                  </Link>
                                )}
                                <CardTitle>{title}</CardTitle>
                                <DateTime
                                  date={broadcastDate || date}
                                  options={{
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }}
                                />
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
                            </Card>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselNext />
                  </CardCarousel>
                </div>
              </div>
            );
          },
        )}

        {/* Team Carousel */}
        {!!team?.length && (
          <div className="grid grid-cols-[max(var(--gutter-left),var(--spacing)*28)_1fr] justify-start gap-y-2 -mb-1">
            <h2 className="col-start-2 justify-self-start pl-4 font-bold text-2xl [&_svg:first-child]:size-8 [&_svg:first-child]:text-cyan">
              <Link href="/programs/the-world/team">Meet th Team</Link>
            </h2>
            <div className="row-start-2 col-span-2 overflow-hidden">
              <CardCarousel>
                <CarouselPrevious className="w-auto opacity-100 pl-[calc(max(var(--gutter-left),var(--spacing)*28)+var(--spacing)*4)]" />
                <CarouselContent>
                  {team
                    ?.filter((v) => !!v)
                    .map(({ id, name, link, contributorDetails }) => {
                      const { position, image } = contributorDetails || {};
                      const contributorLink = generateContentLinkHref(link);
                      const { altText, sourceUrl, mediaItemUrl } = image || {};
                      const imageSrc = sourceUrl || mediaItemUrl;

                      return (
                        <CarouselItem
                          className={cn(
                            "grid basis-45 h-83",
                            "md:nth-of-type-[1]:ml-[calc(max(var(--gutter-left),var(--spacing)*28)+var(--spacing)*2)]",
                          )}
                          key={id}
                        >
                          <Card>
                            {contributorLink && (
                              <CardLink href={contributorLink} />
                            )}
                            {imageSrc && (
                              <CardImage>
                                <Image
                                  src={imageSrc}
                                  alt={altText || ""}
                                  fill
                                  sizes="540px"
                                  style={{
                                    objectFit: "cover",
                                  }}
                                />
                              </CardImage>
                            )}
                            <CardHeader>
                              <CardTitle>{name}</CardTitle>
                              <p>{position}</p>
                            </CardHeader>
                          </Card>
                        </CarouselItem>
                      );
                    })}
                </CarouselContent>
                <CarouselNext />
              </CardCarousel>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
