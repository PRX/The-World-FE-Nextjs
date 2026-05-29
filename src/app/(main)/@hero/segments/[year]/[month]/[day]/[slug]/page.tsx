import type { PlayerAudio } from "@/components/Player";
import type { Contributor } from "@/interfaces";
import Link from "next/link";
import { getCachedSegment } from "@/app/(main)/segments/[year]/[month]/[day]/[slug]/page";
import { DateTime } from "@/components/DateTime";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import AudioBar from "@/app/(main)/_components/AudioBar";
import ShareButton from "@/app/(main)/_components/ShareButton";
import { ColorSchemeSwitcher } from "@/app/(main)/_components/ColorSchemeSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { generateContentLinkHref } from "@/lib/routing/content";
import { cn } from "@/lib/util/css";

export default async function SegmentHero({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCachedSegment(slug);

  if (!data) {
    return null;
  }

  const {
    link,
    date,
    segmentContent,
    segmentDates,
    featuredImage,
    title,
    contributors,
  } = data;
  const image = featuredImage?.node;
  const { audio } = segmentContent || {};
  const audioProps = {
    title,
    queuedFrom: "Page Header Controls",
    ...(image?.sourceUrl && { imageUrl: image.sourceUrl }),
    linkResource: data,
  } as Partial<PlayerAudio>;
  const { broadcastDate } = segmentDates || {};

  return (
    <HeroHeader image={featuredImage?.node}>
      <h1 className="text-3xl md:text-4xl font-bold text-balance">{title}</h1>
      <div className="flex @max-xl/hero-content:flex-wrap content-start gap-x-12 gap-y-2">
        <div className="grow">
          <div className="flex gap-x-4 text-md/snug">
            <DateTime
              date={broadcastDate || date}
              className="font-medium uppercase"
              options={{
                year: "numeric",
                month: "long",
                day: "numeric",
              }}
            />
          </div>
        </div>
        {!!contributors?.nodes.length && (
          <div className="flex flex-wrap gap-2">
            {contributors.nodes.map((contributor: Contributor) => {
              const { id: key, name, link, contributorDetails } = contributor;
              const { image } = contributorDetails || {};
              const { sourceUrl, mediaItemUrl, altText } = image?.node || {};
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
                    "nth-of-type-[5n+1]:**:data-[slot=avatar]:bg-dark-green",
                    "nth-of-type-[5n+2]:**:data-[slot=avatar]:bg-purple",
                    "nth-of-type-[5n+3]:**:data-[slot=avatar]:bg-red",
                    "nth-of-type-[5n+4]:**:data-[slot=avatar]:bg-burnt-orange",
                    "nth-of-type-[5n+5]:**:data-[slot=avatar]:bg-blue",
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
        {audio?.node && (
          <AudioBar
            className="grow"
            audio={audio.node}
            fallbackProps={audioProps}
          />
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
