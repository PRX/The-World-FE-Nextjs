import type { ContentNode } from "@/interfaces";
import { unstable_cache } from "next/cache";
import { isArray } from "lodash";
import Explorer, { ExplorerCard } from "@/app/(main)/_components/Explorer";
import { type ContentQueryOptions, fetchGqlSegments } from "@/lib/fetch";
import { redirectToValidDatedRoute } from "@/lib/routing/redirectToValidDatedRoute";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { convertSearchFiltersToWhereArgs } from "@/lib/convert/string";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "@/app/(main)/_components/CtaRegion";

export const getCachedSegmentsByDate = unstable_cache(
  async (query: ContentQueryOptions) => fetchGqlSegments(query),
  ["content", "segments", "year", "month", "day"],
  {
    tags: ["content", "segments"],
    revalidate: 60,
  },
);

export default async function SegmentsByMonthPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"year" | "month" | "day", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { year: yearParam, month: monthParam, day: dayParam } = await params;
  const resolvedSearchParams = await searchParams;

  redirectToValidDatedRoute(
    "/segments",
    { year: yearParam, month: monthParam, day: dayParam },
    resolvedSearchParams,
  );

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);
  const day = parseInt(monthParam, 10);
  const { search: searchParam, sf: sfParam } = resolvedSearchParams;
  const search = isArray(searchParam) ? searchParam.join(", ") : searchParam;
  const sf = isArray(sfParam) ? sfParam[0] : sfParam;
  const searchFilters = {
    ...decodeContentSearchFiltersParam(sf),
    year,
    month,
    day,
  };
  const whereArgs = convertSearchFiltersToWhereArgs(searchFilters);

  const data = await getCachedSegmentsByDate({
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
      <Explorer fetchEndpoint="segments" pageInfo={pageInfo}>
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
