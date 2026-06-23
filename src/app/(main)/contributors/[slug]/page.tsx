import { type ContentNode, ContributorIdType, type Post } from "@/interfaces";
import { create } from "@bufbuild/protobuf";
import {
  ExcludeIdsListSchema,
  SFTaxonomyEnum,
  TaxonomyContextSchema,
} from "@/gen/search_filters_pb";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import {
  type ContentQueryOptions,
  fetchGqlContent,
  fetchGqlContributor,
} from "@/lib/fetch";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { convertSearchFiltersToWhereArgs } from "@/lib/convert/string";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { cn } from "@/lib/util/css";
import CtaRegion from "@/app/(main)/_components/CtaRegion";
import ContentBody from "@/app/(main)/_components/ContentBody";
import Explorer, {
  ExplorerCard,
  ExplorerClearSearch,
  ExplorerContentTypeFilter,
  ExplorerDateFilter,
  ExplorerSortFilter,
} from "@/app/(main)/_components/Explorer";
import type { Metadata, ResolvingMetadata } from "next";
import { convertSeoToMetadata } from "@/lib/parse/seo";
import { sanitizeSearchParamsForSiteSearch } from "@/lib/sanitize";

type Props = {
  params: Promise<Record<"slug", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const getCachedContributor = cache(async (slug: string) =>
  fetchGqlContributor(slug, ContributorIdType.Slug),
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
    revalidate: 3600,
  },
);

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;
  const metadata = await parent.then((r) => r as Metadata);

  // fetch post information
  const data = await getCachedContributor(slug);

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

  // console.log("CONTRIBUTOR SEO", seo);

  return convertSeoToMetadata(md, metadata) || {};
}

export default async function ContributorPage({ params, searchParams }: Props) {
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
  const excludeIds = (featuredPosts?.nodes as Post[])
    ?.filter((v) => !!v)
    .map((p) => p.databaseId);
  const siteSearchParams =
    sanitizeSearchParamsForSiteSearch(resolvedSearchParams);
  const { search, sf } = siteSearchParams;
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
