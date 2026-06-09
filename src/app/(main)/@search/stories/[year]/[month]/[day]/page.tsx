import SearchInput from "@/app/(main)/_components/SearchInput";
import { SFContentTypeEnum } from "@/gen/search_filters_pb";
import { format } from "date-fns";

export default async function StoriesByDateSearch({
  params,
}: {
  params: Promise<Record<"year" | "month" | "day", string>>;
}) {
  const { year: yearParam, month: monthParam, day: dayParam } = await params;

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);
  const day = parseInt(dayParam, 10);
  const hasNanParams = [year, month, day].reduce(
    (a, v) => a || Number.isNaN(v),
    false,
  );

  if (hasNanParams) {
    return null;
  }

  return (
    <SearchInput
      searchContext={{
        label: `Stories from ${format(new Date(year, month - 1, day), "PPP")}`,
        fetchSearchFilters: {
          contentType: SFContentTypeEnum.POST,
          year,
          month,
          day,
        },
      }}
    />
  );
}
