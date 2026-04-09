import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { CategoryIdType, type ContentNode } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import {
  type ContentQueryOptions,
  fetchGqlCategory,
  fetchGqlContent,
} from "@/lib/fetch";
import Explorer, {
  ExplorerCard,
  ExplorerClearSearch,
  ExplorerContentTypeFilter,
  ExplorerDateFilter,
  ExplorerSortFilter,
} from "@/app/(main)/_components/Explorer";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { isArray } from "lodash";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { convertSearchFiltersToWhereArgs } from "@/lib/convert/string";
import {
  ExcludeIdsListSchema,
  SFTaxonomyEnum,
  TaxonomyContextSchema,
} from "@/gen/search_filters_pb";
import { create } from "@bufbuild/protobuf";
import { cn } from "@/lib/util/css";

export const getCachedCategory = unstable_cache(
  async (slug) => fetchGqlCategory(slug, CategoryIdType.Slug),
  ["category"],
  {
    tags: ["category", "taxonomy"],
    revalidate: 60,
  },
);

export const getCachedCategoryContent = unstable_cache(
  async (
    query: ContentQueryOptions,
    taxonomySingleName: string,
    termSlug: string,
  ) => fetchGqlContent(query, taxonomySingleName, termSlug),
  ["content", "category"],
  {
    tags: ["content", "category", "taxonomy"],
    revalidate: 60,
  },
);

export default async function TaxonomyPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"slugs", string | string[]>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { slugs } = await params;
  const slug = isArray(slugs) ? slugs.pop() || "" : slugs;
  const resolvedSearchParams = await searchParams;
  let data: Awaited<ReturnType<typeof getCachedCategory>>;

  if (slug) {
    data = await getCachedCategory(slug);

    if (!data) return notFound();
  }

  const { id, landingPage } = data || {};
  const { featuredPosts } = landingPage || {};
  const excludeIds = featuredPosts?.filter((v) => !!v).map((p) => p.databaseId);
  const { search: searchParam, sf: sfParam } = resolvedSearchParams;
  const search = isArray(searchParam) ? searchParam.join(", ") : searchParam;
  const sf = isArray(sfParam) ? sfParam[0] : sfParam;
  const searchFilters = {
    ...decodeContentSearchFiltersParam(sf),
    ctx: create(TaxonomyContextSchema, {
      taxonomy: SFTaxonomyEnum.category,
      termSlug: slug,
    }),
    ...(!!excludeIds?.length && {
      exclude: create(ExcludeIdsListSchema, { ids: excludeIds }),
    }),
  };
  const whereArgs = convertSearchFiltersToWhereArgs(searchFilters);
  const contentData = await getCachedCategoryContent(
    {
      first: 60,
      where: {
        search,
        ...whereArgs,
      },
    },
    "category",
    slug,
  );
  const { pageInfo, nodes } = contentData || {};

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-end",
    {
      ...(id && { categories: [id] }),
    },
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
          <ExplorerContentTypeFilter />
          <ExplorerDateFilter />
          <ExplorerClearSearch />
        </div>
        <div className="flex items-center gap-2">
          <ExplorerSortFilter />
        </div>
      </div>
      <Explorer fetchSearchFilters={searchFilters} pageInfo={pageInfo}>
        {[...(featuredPosts || []), ...(nodes || [])]
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
        <div className="px-4">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </div>
  );
}
