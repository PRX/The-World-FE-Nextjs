import type { ContentNode } from "@/interfaces";
import { unstable_cache } from "next/cache";
import { isArray } from "lodash";
import Explorer, {
  ExplorerCard,
  ExplorerClearSearch,
  ExplorerSortFilter,
} from "@/app/(main)/_components/Explorer";
import { redirectToValidDatedRoute } from "@/lib/routing/redirectToValidDatedRoute";
import { type ContentQueryOptions, fetchGqlContent } from "@/lib/fetch";
import { convertSearchFiltersToWhereArgs } from "@/lib/convert/string";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { cn } from "@/lib/util/css";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";

export const getCachedStoriesByYear = unstable_cache(
  async (query: ContentQueryOptions) => fetchGqlContent(query),
  ["content", "stories", "year"],
  {
    tags: ["content", "stories"],
    revalidate: 60,
  },
);

export default async function StoriesByYearPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"year", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { year: yearParam } = await params;
  const resolvedSearchParams = await searchParams;

  redirectToValidDatedRoute(
    "/stories",
    { year: yearParam },
    resolvedSearchParams,
  );

  const year = parseInt(yearParam, 10);
  const { search: searchParam, sf: sfParam } = resolvedSearchParams;
  const search = isArray(searchParam) ? searchParam.join(", ") : searchParam;
  const sf = isArray(sfParam) ? sfParam[0] : sfParam;
  const searchFilters = {
    ...decodeContentSearchFiltersParam(sf),
    contentType: SFContentTypeEnum.POST,
    year,
  };
  const whereArgs = convertSearchFiltersToWhereArgs(searchFilters);

  const data = await getCachedStoriesByYear({
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
    <div className="mt-10 px-8 md:ml-(--gutter-left) md:mr-(--gutter-right)">
      <div
        className={cn(
          "sticky top-(--gutter-top) z-10",
          "flex items-center justify-between gap-2 w-full max-w-7xl mx-auto my-5 p-2",
        )}
      >
        <div className="flex items-center gap-2">
          <ExplorerClearSearch />
        </div>
        <div className="flex items-center gap-2">
          <ExplorerSortFilter />
        </div>
      </div>
      <Explorer fetchSearchFilters={searchFilters} pageInfo={pageInfo}>
        {nodes
          ?.filter((n) => !!n)
          .map((node, index) => {
            return (
              <ExplorerCard
                data={node as ContentNode}
                key={node.id}
                index={index}
              />
            );
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
