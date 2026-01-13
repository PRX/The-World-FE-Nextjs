import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { TagIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlTag } from "@/lib/fetch";
import Explorer from "@/app/(main)/_components/Explorer";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { taxonomySlugToSingularName } from "@/lib/map/taxonomy";

export const getCachedTag = unstable_cache(
  async (slug) => fetchGqlTag(slug, TagIdType.Slug, "tag"),
  ["tag"],
  {
    tags: ["tag", "taxonomy"],
    revalidate: 60,
  },
);

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"slug", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const isTaxonomySlug = taxonomySlugToSingularName.has(slug);
  let data: Awaited<ReturnType<typeof getCachedTag>>;

  if (slug && !isTaxonomySlug) {
    data = await getCachedTag(slug);

    if (!data) return notFound();
  }

  const { name } = data || {};
  const explorerProps = {
    ...(data && {
      tag: !name?.trim()
        ? slug
        : {
            value: slug,
            displayValue: name,
          },
    }),
    searchParams: resolvedSearchParams,
  };

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-end",
  ).then((messages) => getShownMessage(messages));

  return (
    <div className="mt-10 ml-(--gutter-left) mr-(--gutter-right)">
      <Explorer {...explorerProps} />

      {shownContentEndMessage && (
        <div className="px-4">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </div>
  );
}
