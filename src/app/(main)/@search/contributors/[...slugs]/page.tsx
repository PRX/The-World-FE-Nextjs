import type { Contributor } from "@/interfaces";
import SearchInput from "@/app/(main)/_components/SearchInput";
import { getCachedContributor } from "@/app/(main)/contributors/[slug]/page";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";

export default async function ContributorSearch({
  params,
}: {
  params: Promise<Record<"slugs", string | string[]>>;
}) {
  const { slugs } = await params;
  const slug = slugs && (typeof slugs === "string" ? slugs : slugs.pop());
  let data: Contributor | undefined;

  if (slug) {
    data = await getCachedContributor(slug);
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
            taxonomy: SFTaxonomyEnum.contributor,
            termSlug: slug,
          },
        },
      }}
    />
  );
}
