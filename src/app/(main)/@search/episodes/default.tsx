import SearchInput from "@/app/(main)/_components/SearchInput";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";

export default async function DefaultEpisodesSearch() {
  return (
    <SearchInput
      searchContext={{
        label: "Episodes",
        fetchSearchFilters: { contentType: SFContentTypeEnum.EPISODE },
      }}
    />
  );
}
