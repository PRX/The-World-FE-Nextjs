import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { HtmlContent } from "@/components/HtmlContent";
import { EpisodeIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlEpisode } from "@/lib/fetch";
import { unstable_cache } from "next/cache";
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

  const { id, content } = data;

  const shownContentEndMessage = await getCtaRegionMessages(
    "content-inline-end",
    {
      ...(id && { id }),
    },
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="group/episode">
      <div className="ml-(--gutter-left) mr-(--gutter-right)">
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
