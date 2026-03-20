import type { PlayerAudio } from "@/components/Player";
import { getCachedSegment } from "@/app/(main)/segments/[year]/[month]/[day]/[slug]/page";
import { DateTime } from "@/components/DateTime";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import AudioBar from "@/app/(main)/_components/AudioBar";
import ShareButton from "@/app/(main)/_components/ShareButton";
import { ColorSchemeSwitcher } from "@/app/(main)/_components/ColorSchemeSwitcher";
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

  const { link, date, segmentContent, segmentDates, featuredImage, title } =
    data;
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
      <h1 className="capitalize text-3xl md:text-4xl font-bold text-balance">
        {title}
      </h1>
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
