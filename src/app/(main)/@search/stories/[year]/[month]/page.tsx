import SearchInput from "@/app/(main)/_components/SearchInput";
import { format } from "date-fns";

export default async function StoriesByMonthSearch({
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
        label: `Stories from ${format(new Date(year, month - 1), "MMM yyyy")}`,
        fetchEndpoint: "stories/search",
        fetchSearchFilters: { year, month },
      }}
    />
  );
}
