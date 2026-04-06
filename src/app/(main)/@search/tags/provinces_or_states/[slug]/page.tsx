import type { Tag } from "@/interfaces";
import SearchInput from "@/app/(main)/_components/SearchInput";
import { getCachedProvinceOrState } from "@/app/(main)/tags/provinces_or_states/[slug]/page";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";

export default async function ProvinceOrStateSearch({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  let data: Tag | undefined;

  if (slug) {
    data = await getCachedProvinceOrState(slug);
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
            taxonomy: SFTaxonomyEnum.provinceOrState,
            termSlug: slug,
          },
        },
      }}
    />
  );
}
