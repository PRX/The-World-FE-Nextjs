import SearchInput from "@/app/(main)/_components/SearchInput";
import { format } from "date-fns";

export default async function SegmentsByMonthSearch({
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
        label: `Segments from ${format(new Date(year, month - 1), "MMM yyyy")}`,
        fetchEndpoint: "segments/search",
        fetchSearchFilters: { year, month },
      }}
    />
  );
}
