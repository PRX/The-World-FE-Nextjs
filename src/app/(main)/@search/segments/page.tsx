import SearchInput from "@/app/(main)/_components/SearchInput";

export default async function SegmentsSearch() {
  return (
    <SearchInput
      searchContext={{ label: "Segments", fetchEndpoint: "segments/search" }}
    />
  );
}
