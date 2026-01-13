import { redirectToValidDatedRoute } from "@/lib/routing/redirectToValidDatedRoute";
import Explorer from "@/app/(main)/_components/Explorer";

export default async function SegmentsByYearPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"year", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { year } = await params;
  const resolvedSearchParams = await searchParams;

  redirectToValidDatedRoute("/segments", { year }, resolvedSearchParams);

  return (
    <div className="mt-6 ml-(--gutter-left) mr-(--gutter-right)">
      <Explorer
        type="segment"
        year={year}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
