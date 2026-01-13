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

  const date = new Date(`${year}-${month}-${day}`);

  return (
    <div className="mt-6 ml-(--gutter-left) mr-(--gutter-right)">
      <Explorer
        type="segment"
        date={date}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
