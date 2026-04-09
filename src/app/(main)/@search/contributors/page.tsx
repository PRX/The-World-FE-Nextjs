import SearchInput from "@/app/(main)/_components/SearchInput";
import { SFTaxonomyEnum } from "@/gen/search_filters_pb";

export default async function CategoriesSearch() {
  return (
    <SearchInput
      searchContext={{
        label: "Contributors",
        fetchEndpoint: "search/terms",
        fetchSearchFilters: { ctx: { taxonomy: SFTaxonomyEnum.contributor } },
      }}
    />
  );
}
