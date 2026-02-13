import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import ContentBody from "@/app/(main)/_components/ContentBody";
import { Plausible, type PlausibleEventArgs } from "@/components/Plausible";
import { PostIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlStory } from "@/lib/fetch";
import { parseDateParts } from "@/lib/parse/date";
import { unstable_cache } from "next/cache";

type Props = {
  params: Promise<{ slug: string }>;
};

export const getCachedStory = unstable_cache(
  async (slug) => fetchGqlStory(slug, PostIdType.Slug),
  ["story"],
  {
    tags: ["story", "content"],
    revalidate: 60,
  },
);

export async function generateMetadata(
  { params }: Props,
  // parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;

  // fetch post information
  const data = await getCachedStory(slug);

  if (!data) {
    return notFound();
  }

  const { seo, date, additionalDates } = data;
  const { broadcastDate } = additionalDates || {};

  // console.log(seo);

  return {
    ...seo, // TODO: Create util to convert seo data to Nextjs Metadata.
    ...((broadcastDate || date) && {
      pubdate: broadcastDate || date,
    }),
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCachedStory(slug);

  if (!data) {
    return notFound();
  }

  const {
    id,
    title,
    date,
    content,
    additionalDates,
    resourceDevelopmentTags,
    storyFormats,
  } = data;
  const { broadcastDate } = additionalDates || {};
  const storyFormat = storyFormats?.nodes[0]?.name;
  const props = {
    Title: title,
    ...(storyFormat && { "Story Format": storyFormat }),
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
  const plausibleEvents = [["Story", { props }] as PlausibleEventArgs];

  const shownContentEndMessage = await getCtaRegionMessages(
    "content-inline-end",
    {
      ...(id && { id }),
    },
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="group/content">
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
