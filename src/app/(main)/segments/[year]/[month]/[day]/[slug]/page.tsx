import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { Plausible, type PlausibleEventArgs } from "@/components/Plausible";
import ContentBody from "@/app/(main)/_components/ContentBody";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { SegmentIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlSegment } from "@/lib/fetch";
import { parseDateParts } from "@/lib/parse/date";

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

  const { id, date, title, content, resourceDevelopmentTags, segmentDates } =
    data;
  const { broadcastDate } = segmentDates || {};
  const props = {
    Title: title,
    ...(!!resourceDevelopmentTags?.nodes.length && {
      "Resource Development": resourceDevelopmentTags.nodes[0].name,
    }),
    ...(broadcastDate &&
      (() => {
        const dt = parseDateParts(broadcastDate);
        return {
          "Broadcast Year": dt[0],
          "Broadcast Month": dt.slice(0, 2).join("-"),
          "Broadcast Date": dt.join("-"),
        };
      })()),
    ...(date &&
      (() => {
        const dt = parseDateParts(date);
        return {
          "Published Year": dt[0],
          "Published Month": dt.slice(0, 2).join("-"),
          "Published Date": dt.join("-"),
        };
      })()),
  };
  const plausibleEvents = [["Segment", { props }] as PlausibleEventArgs];

  const shownContentEndMessage = await getCtaRegionMessages(
    "content-inline-end",
    {
      ...(id && { id }),
    },
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="group/segment">
      <Plausible events={plausibleEvents} key={id} />
      <div className="relative ps-(--gutter-left)">
        <ContentBody html={content}>
          {shownContentEndMessage && (
            <div className="px-4">
              <CtaRegion cta={shownContentEndMessage} />
            </div>
          )}
        </ContentBody>
      </div>
    </div>
  );
}
