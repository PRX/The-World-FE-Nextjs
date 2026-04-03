import SearchInput from "@/app/(main)/_components/SearchInput";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";

export default async function StoriesSearch() {
  return (
    <SearchInput
      searchContext={{
        label: "Stories",
        fetchSearchFilters: { contentType: SFContentTypeEnum.POST },
      }}
    />
  );
}
