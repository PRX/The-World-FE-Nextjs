import type { Tag } from "@/interfaces";
import SearchInput from "@/app/(main)/_components/SearchInput";
import { getCachedCity } from "@/app/(main)/tags/cities/[slug]/page";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";

export default async function CitySearch({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  let data: Tag | undefined;

  if (slug) {
    data = await getCachedCity(slug);
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
            taxonomy: SFTaxonomyEnum.city,
            termSlug: slug,
          },
        },
      }}
    />
  );
}
