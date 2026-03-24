import CtaRegion from "@/app/(main)/_components/CtaRegion";
import { CategoryIdType } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import { fetchGqlCategory } from "@/lib/fetch";
import Explorer from "@/app/(main)/_components/Explorer";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

export const getCachedCategory = unstable_cache(
  async (slug) => fetchGqlCategory(slug, CategoryIdType.Slug),
  ["category"],
  {
    tags: ["category", "taxonomy"],
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
  const slug = slugs && (typeof slugs === "string" ? slugs : slugs.pop());
  const resolvedSearchParams = await searchParams;
  let data: Awaited<ReturnType<typeof getCachedCategory>>;

  if (slug) {
    data = await getCachedCategory(slug);

    if (!data) return notFound();
  }

  const { id, name } = data || {};
  const explorerProps = {
    options: {
      ...(slug &&
        name && {
          category: {
            value: slug,
            displayValue: name,
          },
        }),
    },
  };

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-end",
    {
      ...(id && { categories: [id] }),
    },
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
