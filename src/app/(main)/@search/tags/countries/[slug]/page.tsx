import type { Tag } from "@/interfaces";
import SearchInput from "@/app/(main)/_components/SearchInput";
import { getCachedCountry } from "@/app/(main)/tags/countries/[slug]/page";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";

export default async function CountrySearch({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  let data: Tag | undefined;

  if (slug) {
    data = await getCachedCountry(slug);
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
            taxonomy: SFTaxonomyEnum.country,
            termSlug: slug,
          },
        },
      }}
    />
  );
}
