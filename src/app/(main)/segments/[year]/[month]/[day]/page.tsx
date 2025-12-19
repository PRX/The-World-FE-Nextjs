import { redirectToValidDatedRoute } from "@/lib/routing/redirectToValidDatedRoute";
import Explorer from "@/app/(main)/_components/Explorer";

export default async function SegmentsByDayPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"year" | "month" | "day", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { year, month, day } = await params;
  const resolvedSearchParams = await searchParams;

  redirectToValidDatedRoute(
    "/segments",
    { year, month, day },
    resolvedSearchParams,
  );

  const after = new Date(`${year}-${month}-${day}`);
  const before = new Date(after);

  before.setDate(before.getDate() + 1);
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
