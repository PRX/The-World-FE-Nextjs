import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { HtmlContent } from "@/components/HtmlContent";
import { SegmentIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlSegment } from "@/lib/fetch";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

export const getCachedSegment = unstable_cache(
  async (slug) => fetchGqlSegment(slug, SegmentIdType.Slug),
  ["segment"],
  {
    tags: ["segment", "content"],
    revalidate: 60,
  },
);

export default async function SegmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCachedSegment(slug);

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
