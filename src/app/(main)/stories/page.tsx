import type { ContentNode } from "@/interfaces";
import { unstable_cache } from "next/cache";
import Explorer, {
  ExplorerCard,
  ExplorerClearSearch,
  ExplorerDateFilter,
  ExplorerSortFilter,
} from "@/app/(main)/_components/Explorer";
import { type ContentQueryOptions, fetchGqlContent } from "@/lib/fetch";
import { convertSearchFiltersToWhereArgs } from "@/lib/convert/string";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { cn } from "@/lib/util/css";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";
import type { Metadata, ResolvingMetadata } from "next";
import { convertSeoToMetadata } from "@/lib/parse/seo";
import { sanitizeSearchParamsForSiteSearch } from "@/lib/sanitize";

export const getCachedStories = unstable_cache(
  async (query: ContentQueryOptions) => fetchGqlContent(query),
  ["content", "stories"],
  {
    tags: ["content", "stories"],
    revalidate: 3600,
  },
);

export async function generateMetadata(
  _props: Record<string, string>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const metadata = await parent.then((r) => r as Metadata);
  const seoTitle = "Stories";
  const link = "https://theworld.org/stories";
  const md = {
    canonical: link,
    title: seoTitle,
    opengraphTitle: seoTitle,
    opengraphUrl: link,
    twitterTitle: seoTitle,
  };

  return convertSeoToMetadata(md, metadata) || {};
}

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = await searchParams;

  const siteSearchParams =
    sanitizeSearchParamsForSiteSearch(resolvedSearchParams);
  const { search, sf } = siteSearchParams;
  const searchFilters = {
    ...decodeContentSearchFiltersParam(sf),
    contentType: SFContentTypeEnum.POST,
  };
  const whereArgs = convertSearchFiltersToWhereArgs(searchFilters);

  const data = await getCachedStories({
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
          <ExplorerDateFilter />
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
