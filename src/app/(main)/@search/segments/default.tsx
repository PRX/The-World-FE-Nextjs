import SearchInput from "@/app/(main)/_components/SearchInput";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";

export default async function DefaultSegmentsSearch() {
  return (
    <SearchInput
      searchContext={{
        label: "Segments",
        fetchSearchFilters: { contentType: SFContentTypeEnum.SEGMENT },
      }}
    />
  );
}
