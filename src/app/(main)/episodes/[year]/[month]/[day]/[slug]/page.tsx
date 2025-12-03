import CtaRegion from "@/app/(main)/_components/CtaRegion";
import HeaderImage from "@/app/(main)/_components/HeaderImage";
import { DateTime } from "@/components/DateTime";
import { HtmlContent } from "@/components/HtmlContent";
import { EpisodeIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlEpisode } from "@/lib/fetch";
import cn from "@/lib/util/css/cn";
import { ImageIcon } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

export const getCachedEpisode = unstable_cache(
  async (slug) => fetchGqlEpisode(slug, EpisodeIdType.Slug),
  ["episode"],
  {
    tags: ["episodes", "content"],
    revalidate: 60,
  },
);

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCachedEpisode(slug);

  if (!data) {
    return notFound();
  }

  const { id, content, date, episodeDates, featuredImage, title } = data;
  const { broadcastDate } = episodeDates || {};
  const { caption, imageFields } = featuredImage?.node || {};
  const { mediaCredit, mediaCreditUrl } = imageFields || {};
  const hasCaption = !!caption?.length;
  const hasCredit = !!mediaCredit?.length;
  const hasImageInfo = hasCaption || hasCredit;

  const shownContentEndMessage = await getCtaRegionMessages(
    "content-inline-end",
    {
      ...(id && { id }),
    },
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="group/episode">
      <div
        className={cn(
          "relative grid content-end pt-(--gutter-top) pb-[25svh] -mb-[25svh] ps-(--gutter-left)",
          {
            "min-h-screen md:min-h-[calc(90vh+var(--gutter-top))]":
              !!featuredImage,
          },
        )}
      >
        {featuredImage?.node && <HeaderImage data={featuredImage.node} />}
        <div className="grid gap-4 content-end max-w-250 mx-auto p-4">
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
          {hasImageInfo && (
            <div className="grid grid-cols-[max-content_1fr] gap-4 justify-between items-start">
              <ImageIcon className="w-6 my-0.75" />
              <div className="flex flex-wrap justify-between items-center gap-2 min-h-7.5">
                {hasCaption && (
                  <span className="font-light text-xs/tight text-pretty">
                    <HtmlContent html={caption} />
                  </span>
                )}
                {hasCredit && (
                  <span className="text-xs/tight font-light whitespace-nowrap">
                    {mediaCreditUrl ? (
                      <Link href={mediaCreditUrl}>{mediaCredit}</Link>
                    ) : (
                      mediaCredit
                    )}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative ps-(--gutter-left)">
        <div className="max-w-185 mx-auto my-12 px-4">
          <HtmlContent html={content} />
        </div>

        {shownContentEndMessage && (
          <div className="px-4">
            <CtaRegion cta={shownContentEndMessage} />
          </div>
        )}
      </div>
    </div>
  );
}
