import type { ContentNode } from "@/interfaces";
import { unstable_cache } from "next/cache";
import { isArray } from "lodash";
import Explorer, { ExplorerCard } from "@/app/(main)/_components/Explorer";
import { type ContentQueryOptions, fetchGqlEpisodes } from "@/lib/fetch";
import { convertSearchFiltersToWhereArgs } from "@/lib/convert/string";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "@/app/(main)/_components/CtaRegion";

export const getCachedEpisodes = unstable_cache(
  async (query: ContentQueryOptions) => fetchGqlEpisodes(query),
  ["content", "episodes"],
  {
    tags: ["content", "episodes"],
    revalidate: 60,
  },
);

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = await searchParams;

  const { search: searchParam, sf: sfParam } = resolvedSearchParams;
  const search = isArray(searchParam) ? searchParam.join(", ") : searchParam;
  const sf = isArray(sfParam) ? sfParam[0] : sfParam;
  const searchFilters = {
    ...decodeContentSearchFiltersParam(sf),
  };
  const whereArgs = convertSearchFiltersToWhereArgs(searchFilters);

  const data = await getCachedEpisodes({
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
    <div className="mt-6 ml-(--gutter-left) mr-(--gutter-right)">
      <Explorer fetchEndpoint="episodes" pageInfo={pageInfo}>
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
