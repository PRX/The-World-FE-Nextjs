import SearchInput from "@/app/(main)/_components/SearchInput";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";
import { format } from "date-fns";

export default async function StoriesByMonthSearch({
  params,
}: {
  params: Promise<Record<"year" | "month", string>>;
}) {
  const { year: yearParam, month: monthParam } = await params;

  console.log(yearParam, monthParam);

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);
  const hasNanParams = [year, month].reduce(
    (a, v) => a || Number.isNaN(v),
    false,
  );

  if (hasNanParams) {
    return null;
  }

  return (
    <SearchInput
      searchContext={{
        label: `Stories from ${format(new Date(year, month - 1), "MMM yyyy")}`,
        fetchSearchFilters: {
          contentType: SFContentTypeEnum.POST,
          year,
          month,
        },
      }}
    />
  );
}
