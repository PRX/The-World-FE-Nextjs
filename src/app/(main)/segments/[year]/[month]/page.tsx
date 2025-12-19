import { redirectToValidDatedRoute } from "@/lib/routing/redirectToValidDatedRoute";
import Explorer from "@/app/(main)/_components/Explorer";

export default async function SegmentsByMonthPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"year" | "month", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { year, month } = await params;
  const resolvedSearchParams = await searchParams;

  redirectToValidDatedRoute("/segments", { year, month }, resolvedSearchParams);

  const after = new Date(`${year}-${month}`);
  const before = new Date(after);

  before.setMonth(before.getMonth() + 1);
  before.setMilliseconds(-1);

  return (
    <div className="mt-6 ml-(--gutter-left) mr-(--gutter-right)">
      <Explorer
        type="segment"
        date={{ after, before }}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
