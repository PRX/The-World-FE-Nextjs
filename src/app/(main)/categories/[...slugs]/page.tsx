import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { CategoryIdType, type Post, type ContentNode } from "@/interfaces";
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
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { convertSearchFiltersToWhereArgs } from "@/lib/convert/string";
import {
  ExcludeIdsListSchema,
  SFTaxonomyEnum,
  TaxonomyContextSchema,
} from "@/gen/search_filters_pb";
import { create } from "@bufbuild/protobuf";
import { cn } from "@/lib/util/css";
import type { Metadata, ResolvingMetadata } from "next";
import { convertSeoToMetadata } from "@/lib/parse/seo";
import { sanitizeSearchParamsForSiteSearch } from "@/lib/sanitize";

type Props = {
  params: Promise<Record<"slugs", string[]>>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const getCachedCategory = cache(async (slug: string) =>
  fetchGqlCategory(slug, CategoryIdType.Slug),
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
    revalidate: 3600,
  },
);

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slugs } = await params;
  const slug = slugs.pop() || "";
  const metadata = await parent.then((r) => r as Metadata);

  // fetch post information
  const data = await getCachedCategory(slug);

  if (!data) {
    return notFound();
  }

  const { name, description, seo, link } = data;
  const md = seo || {
    canonical: link,
    title: name,
    metaDesc: description,
    opengraphTitle: name,
    opengraphDescription: description,
    opengraphUrl: link,
    twitterTitle: name,
    twitterDescription: description,
  };

  // console.log("CATEGORY SEO", seo);

  return convertSeoToMetadata(md, metadata) || {};
}

export default async function TaxonomyPage({ params, searchParams }: Props) {
  const { slugs } = await params;
  const slug = slugs.pop() || "";
  const resolvedSearchParams = await searchParams;
  let data: Awaited<ReturnType<typeof getCachedCategory>>;

  if (slug) {
    data = await getCachedCategory(slug);

    if (!data) return notFound();
  }

  const { id, landingPage } = data || {};
  const { featuredPosts } = landingPage || {};
  const excludeIds = (featuredPosts?.nodes as Post[])
    ?.filter((v) => !!v)
    .map((p) => p.databaseId);
  const siteSearchParams =
    sanitizeSearchParamsForSiteSearch(resolvedSearchParams);
  const { search, sf } = siteSearchParams;
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
        {[...(featuredPosts?.nodes || []), ...(nodes || [])]
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
