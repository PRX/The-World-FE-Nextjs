import SearchInput from "@/app/(main)/_components/SearchInput";

export default async function DefaultStoriesSearch() {
  return (
    <SearchInput
      searchContext={{ label: "Stories", fetchEndpoint: "stories/search" }}
    />
  );
}
