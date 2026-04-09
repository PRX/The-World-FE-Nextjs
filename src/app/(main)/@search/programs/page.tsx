import SearchInput from "@/app/(main)/_components/SearchInput";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";

export default async function TagsSearch() {
  return (
    <SearchInput
      searchContext={{
        label: "Programs",
        fetchEndpoint: "search/terms",
        fetchSearchFilters: { ctx: { taxonomy: SFTaxonomyEnum.program } },
      }}
    />
  );
}
