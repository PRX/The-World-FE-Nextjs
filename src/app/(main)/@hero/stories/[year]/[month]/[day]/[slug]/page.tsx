import type { PlayerAudio } from "@/components/Player";
import type { Contributor } from "@/interfaces";
import Link from "next/link";
import { BookmarkIcon } from "lucide-react";
import AudioBar from "@/app/(main)/_components/AudioBar";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { getCachedStory } from "@/app/(main)/stories/[year]/[month]/[day]/[slug]/page";
import { DateTime } from "@/components/DateTime";
import { HtmlContent } from "@/components/HtmlContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { generateContentLinkHref } from "@/lib/routing/content";
import { cn } from "@/lib/utils";
import ShareButton from "@/app/(main)/_components/ShareButton";
import { ColorSchemeSwitcher } from "@/app/(main)/_components/ColorSchemeSwitcher";

export default async function StoryHero({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCachedStory(slug);

  if (!data) {
    return null;
  }

  const {
    title,
    link,
    date,
    excerpt,
    featuredImage,
    additionalMedia,
    additionalDates,
    primaryCategory,
    contributors,
  } = data;
  const { audio } = additionalMedia || {};
  const { updatedDate } = additionalDates || {};
  const image = featuredImage?.node;
  const audioProps = {
    title,
    queuedFrom: "Page Header Controls",
    ...(image?.sourceUrl && { imageUrl: image.sourceUrl }),
    linkResource: data,
  } as Partial<PlayerAudio>;
  const primaryCategoryHref =
    primaryCategory?.link && generateContentLinkHref(primaryCategory.link);

  return (
    <HeroHeader image={featuredImage?.node}>
      <h1 className="capitalize text-3xl md:text-4xl font-bold text-balance">
        {title}
      </h1>
      <div className="flex @max-xl/hero-content:flex-wrap content-start gap-x-12 gap-y-2">
        <div className="grow flex flex-col gap-y-4">
          {excerpt && <HtmlContent html={excerpt} className="text-xl/snug" />}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-lg">
            {primaryCategoryHref && (
              <Button
                variant="ghost"
                className="flex items-center gap-x-2 -ms-3 font-serif text-inherit"
                asChild
              >
                <Link href={primaryCategoryHref}>
                  <BookmarkIcon className="text-cyan" /> {primaryCategory.name}
                </Link>
              </Button>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <DateTime
                date={date}
                className="font-medium uppercase"
                options={{
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }}
              />
              {updatedDate && (
                <span className="text-cyan font-medium uppercase">
                  Updated:{" "}
                  <DateTime
                    date={updatedDate}
                    options={{
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }}
                  />
                </span>
              )}
            </div>
          </div>
        </div>
        {!!contributors?.nodes.length && (
          <div className="flex @max-xl/hero-content:flex-wrap @xl/hero-content:flex-col gap-2">
            {contributors.nodes.map((contributor: Contributor) => {
              const { id: key, name, link, contributorDetails } = contributor;
              const { image } = contributorDetails || {};
              const { sourceUrl, mediaItemUrl, altText } = image || {};
              const imageUrl = sourceUrl || mediaItemUrl;
              const initials = name
                ?.match(/\b(\w)/g)
                ?.join("")
                .toUpperCase();
              const href = generateContentLinkHref(link) || "";

              return (
                <Button
                  className={cn(
                    "justify-start rounded-full ps-0",
                    "**:data-[slot=avatar-fallback]:text-white",
                    "nth-of-type-[5n+1]:**:data-[slot=avatar-fallback]:bg-dark-green",
                    "nth-of-type-[5n+2]:**:data-[slot=avatar-fallback]:bg-purple",
                    "nth-of-type-[5n+3]:**:data-[slot=avatar-fallback]:bg-red",
                    "nth-of-type-[5n+4]:**:data-[slot=avatar-fallback]:bg-burnt-orange",
                    "nth-of-type-[5n+5]:**:data-[slot=avatar-fallback]:bg-blue",
                  )}
                  variant="ghost"
                  size="lg"
                  key={key}
                  asChild
                >
                  <Link href={href}>
                    <Avatar size="lg">
                      {imageUrl && (
                        <AvatarImage src={imageUrl} alt={altText || ""} />
                      )}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    {name}
                  </Link>
                </Button>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex justify-between items-stretch gap-x-4">
        {audio && (
          <AudioBar className="grow" audio={audio} fallbackProps={audioProps} />
        )}
        <ShareButton
          title={title || undefined}
          url={link}
          buttonProps={{ className: cn({ "h-auto": !!audio }) }}
          menuContentProps={{ align: "start" }}
        />
        <ColorSchemeSwitcher />
      </div>
    </HeroHeader>
  );
}
