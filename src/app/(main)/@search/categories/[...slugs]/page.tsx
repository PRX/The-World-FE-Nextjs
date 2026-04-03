import type { Category } from "@/interfaces";
import SearchInput from "@/app/(main)/_components/SearchInput";
import { getCachedCategory } from "@/app/(main)/categories/[...slugs]/page";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";

export default async function EpisodesByYearSearch({
  params,
}: {
  params: Promise<Record<"slugs", string | string[]>>;
}) {
  const { slugs } = await params;
  const slug = slugs && (typeof slugs === "string" ? slugs : slugs.pop());
  let data: Category | undefined;

  if (slug) {
    data = await getCachedCategory(slug);
  }

  if (!data) {
    return null;
  }

  const { name } = data;

  return (
    <SearchInput
      searchContext={{
        label: name || "",
        fetchSearchFilters: {
          ctx: {
            taxonomy: SFTaxonomyEnum.category,
            termSlug: slug,
          },
        },
      }}
    />
  );
}
