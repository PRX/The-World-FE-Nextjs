import type { ContentNode } from "@/interfaces";
import { unstable_cache } from "next/cache";
import { isArray } from "lodash";
import { type ContentQueryOptions, fetchGqlContent } from "@/lib/fetch";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import Explorer, { ExplorerCard } from "@/app/(main)/_components/Explorer";
import { convertSFParamToWhereArgs } from "@/lib/convert/string";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";

export const getCachedExploreContent = unstable_cache(
  async (query: ContentQueryOptions) => fetchGqlContent(query),
  ["content"],
  {
    tags: ["content"],
    revalidate: 60,
  },
);

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { search: searchParam, sf } = resolvedSearchParams;
  const search = isArray(searchParam) ? searchParam.join(", ") : searchParam;
  const whereArgs = convertSFParamToWhereArgs(sf);

  const data = await getCachedExploreContent({
    first: 60,
    where: {
      search,
      ...whereArgs,
    },
  });
  const { pageInfo, nodes } = data || {};

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-bottom",
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="mt-10 px-8 md:ml-(--gutter-left)">
      <Explorer
        className="w-full max-w-7xl mx-auto"
        pageInfo={pageInfo}
        key={`explore:${search}:${sf}`}
      >
        {nodes
          ?.filter((n) => !!n)
          .map((node) => {
            return <ExplorerCard data={node as ContentNode} key={node.id} />;
          })}
      </Explorer>

      {shownContentEndMessage && (
        <div className="px-4 mt-20 ml-(--_gutter-left)">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </div>
  );
}
