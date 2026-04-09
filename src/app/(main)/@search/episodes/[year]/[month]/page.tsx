import SearchInput from "@/app/(main)/_components/SearchInput";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";
import { format } from "date-fns";

export default async function EpisodesByMonthSearch({
  params,
}: {
  params: Promise<Record<"year" | "month", string>>;
}) {
  const { year: yearParam, month: monthParam } = await params;

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);
  return (
    <SearchInput
      searchContext={{
        label: `Episodes from ${format(new Date(year, month - 1), "MMM yyyy")}`,
        fetchSearchFilters: {
          contentType: SFContentTypeEnum.EPISODE,
          year,
          month,
        },
      }}
    />
  );
}
