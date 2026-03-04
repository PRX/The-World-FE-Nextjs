import { getCachedSegment } from "@/app/(main)/segments/[year]/[month]/[day]/[slug]/page";
import { DateTime } from "@/components/DateTime";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import AudioBar from "@/app/(main)/_components/AudioBar";

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

  const { date, segmentContent, segmentDates, featuredImage, title } = data;
  const { audio } = segmentContent || {};
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
      {audio && <AudioBar audio={audio} />}
    </HeroHeader>
  );
}
