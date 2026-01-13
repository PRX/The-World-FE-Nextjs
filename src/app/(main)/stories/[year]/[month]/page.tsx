import { redirectToValidDatedRoute } from "@/lib/routing/redirectToValidDatedRoute";
import Explorer from "@/app/(main)/_components/Explorer";

export default async function StoriesByMonthPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"year" | "month", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { year, month } = await params;
  const resolvedSearchParams = await searchParams;

  redirectToValidDatedRoute("/stories", { year, month }, resolvedSearchParams);

  return (
    <div className="mt-6 ml-(--gutter-left) mr-(--gutter-right)">
      <Explorer
        type="post"
        year={year}
        month={month}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
