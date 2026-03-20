import type { ContentNode } from "@/interfaces";
import { unstable_cache } from "next/cache";
import { isArray } from "lodash";
import { type ContentQueryOptions, fetchGqlContent } from "@/lib/fetch";
import Explorer from "@/app/(main)/_components/Explorer/Explorer";
import { ExplorerCard } from "../_components/Explorer";
import { convertSFParamToWhereArgs } from "@/lib/convert/string";

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

  return (
    <div className="mt-10 px-8 md:ml-(--gutter-left)">
      <Explorer
        className="w-full max-w-7xl mx-auto"
        searchParams={resolvedSearchParams}
        pageInfo={pageInfo}
      >
        {nodes?.map((node: ContentNode) => {
          if (!node) return null;

          return <ExplorerCard data={node} key={node.id} />;
        })}
      </Explorer>
    </div>
  );
}
