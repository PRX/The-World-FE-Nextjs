import SearchInput from "@/app/(main)/_components/SearchInput";

export default async function DefaultSegmentsSearch() {
  return (
    <SearchInput
      searchContext={{ label: "Segments", fetchEndpoint: "segments/search" }}
    />
  );
}
