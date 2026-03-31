import SearchInput from "@/app/(main)/_components/SearchInput";

export default async function EpisodesByYearSearch({
  params,
}: {
  params: Promise<Record<"year", string>>;
}) {
  const { year: yearParam } = await params;

  const year = parseInt(yearParam, 10);
  return (
    <SearchInput
      searchContext={{
        label: `Episodes from ${year}`,
        fetchEndpoint: "episodes/search",
        fetchSearchFilters: { year },
      }}
    />
  );
}
