import SearchInput from "@/app/(main)/_components/SearchInput";

export default async function StoriesSearch() {
  return (
    <SearchInput
      searchContext={{ label: "Stories", fetchEndpoint: "stories/search" }}
    />
  );
}
