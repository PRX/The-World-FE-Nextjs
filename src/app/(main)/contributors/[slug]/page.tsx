import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { type ContentNode, ContributorIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import {
  type ContentQueryOptions,
  fetchGqlContent,
  fetchGqlContributor,
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
import { HtmlContent } from "@/components/HtmlContent";
import { isArray } from "lodash";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import {
  ExcludeIdsListSchema,
  SFTaxonomyEnum,
  TaxonomyContextSchema,
} from "@/gen/search_filters_pb";
import { create } from "@bufbuild/protobuf";
import { convertSearchFiltersToWhereArgs } from "@/lib/convert/string";
import { cn } from "@/lib/util/css";
import ContentBody from "../../_components/ContentBody";

export const getCachedContributor = unstable_cache(
  async (slug) => fetchGqlContributor(slug, ContributorIdType.Slug),
  ["contributor"],
  {
    tags: ["contributor", "taxonomy"],
    revalidate: 60,
  },
);

export const getCachedContributorContent = unstable_cache(
  async (
    query: ContentQueryOptions,
    taxonomySingleName: string,
    termSlug: string,
  ) => fetchGqlContent(query, taxonomySingleName, termSlug),
  ["content", "contributor"],
  {
    tags: ["content", "contributor", "taxonomy"],
    revalidate: 60,
  },
);

export default async function ContributorPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"slug", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  let data: Awaited<ReturnType<typeof getCachedContributor>>;

  if (slug) {
    data = await getCachedContributor(slug);

    if (!data) return notFound();
  }

  const { description, contributorDetails, landingPage } = data || {};
  const { bio } = contributorDetails || {};
  const content = bio || description;
  const hasContent = !!content?.trim();
  const { featuredPosts } = landingPage || {};
  const excludeIds = featuredPosts?.filter((v) => !!v).map((p) => p.databaseId);
  const { search: searchParam, sf: sfParam } = resolvedSearchParams;
  const search = isArray(searchParam) ? searchParam.join(", ") : searchParam;
  const sf = isArray(sfParam) ? sfParam[0] : sfParam;
  const searchFilters = {
    ...decodeContentSearchFiltersParam(sf),
    ctx: create(TaxonomyContextSchema, {
      taxonomy: SFTaxonomyEnum.contributor,
      termSlug: slug,
    }),
    ...(!!excludeIds?.length && {
      exclude: create(ExcludeIdsListSchema, { ids: excludeIds }),
    }),
  };
  const whereArgs = convertSearchFiltersToWhereArgs(searchFilters);
  const contentData = await getCachedContributorContent(
    {
      first: 60,
      where: {
        search,
        ...whereArgs,
      },
    },
    "contributor",
    slug,
  );
  const { pageInfo, nodes } = contentData || {};

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-end",
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="mt-10 ml-(--gutter-left) mr-(--gutter-right)">
      {hasContent && <ContentBody html={content} className="max-w-6xl" />}

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
