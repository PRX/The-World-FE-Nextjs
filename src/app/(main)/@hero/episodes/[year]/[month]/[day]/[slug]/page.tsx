import { getCachedEpisode } from "@/app/(main)/episodes/[year]/[month]/[day]/[slug]/page";
import { DateTime } from "@/components/DateTime";
import HeroHeader from "@/app/(main)/_components/HeroHeader";

export default async function EpisodeHero({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCachedEpisode(slug);

  if (!data) {
    return null;
  }

  const { date, episodeDates, featuredImage, title } = data;
  const { broadcastDate } = episodeDates || {};

  return (
    <HeroHeader image={featuredImage?.node}>
      <h1 className="capitalize text-3xl md:text-4xl font-bold text-balance">
        {title}
      </h1>
      <div className="flex gap-x-4 text-md/snug">
        <span className="font-serif uppercase italic">Full Episode</span>
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
    </HeroHeader>
  );
}
