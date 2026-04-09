import SearchInput from "@/app/(main)/_components/SearchInput";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";

export default async function StoriesByYearSearch({
  params,
}: {
  params: Promise<Record<"year", string>>;
}) {
  const { year: yearParam } = await params;

  const year = parseInt(yearParam, 10);
  return (
    <SearchInput
      searchContext={{
        label: `Stories from ${year}`,
        fetchSearchFilters: { contentType: SFContentTypeEnum.POST, year },
      }}
    />
  );
}
