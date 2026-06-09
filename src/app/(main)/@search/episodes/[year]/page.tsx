import SearchInput from "@/app/(main)/_components/SearchInput";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";

export default async function EpisodesByYearSearch({
  params,
}: {
  params: Promise<Record<"year", string>>;
}) {
  const { year: yearParam } = await params;

  const year = parseInt(yearParam, 10);
  const hasNanParams = Number.isNaN(year);

  if (hasNanParams) {
    return null;
  }

  return (
    <SearchInput
      searchContext={{
        label: `Episodes from ${year}`,
        fetchSearchFilters: { contentType: SFContentTypeEnum.EPISODE, year },
      }}
    />
  );
}
