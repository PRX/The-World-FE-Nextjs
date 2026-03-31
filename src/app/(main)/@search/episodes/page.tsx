import SearchInput from "@/app/(main)/_components/SearchInput";

export default async function EpisodesSearch() {
  return (
    <SearchInput
      searchContext={{ label: "Episodes", fetchEndpoint: "episodes/search" }}
    />
  );
}
