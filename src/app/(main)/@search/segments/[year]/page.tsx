import SearchInput from "@/app/(main)/_components/SearchInput";

export default async function SegmentsByYearSearch({
  params,
}: {
  params: Promise<Record<"year", string>>;
}) {
  const { year: yearParam } = await params;

  const year = parseInt(yearParam, 10);
  return (
    <SearchInput
      searchContext={{
        label: `Segments from ${year}`,
        fetchEndpoint: "segments/search",
        fetchSearchFilters: { year },
      }}
    />
  );
}
