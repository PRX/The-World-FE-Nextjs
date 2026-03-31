import SearchInput from "@/app/(main)/_components/SearchInput";

export default async function DefaultEpisodesSearch() {
  return (
    <SearchInput
      searchContext={{ label: "Episodes", fetchEndpoint: "episodes/search" }}
    />
  );
}
