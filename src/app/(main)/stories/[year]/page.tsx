import { redirectToValidDatedRoute } from "@/lib/routing/redirectToValidDatedRoute";
import Explorer from "@/app/(main)/_components/Explorer";

export default async function StoriesByYearPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"year", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { year } = await params;
  const resolvedSearchParams = await searchParams;

  redirectToValidDatedRoute("/stories", { year }, resolvedSearchParams);

  const after = new Date(`${year}-01`);
  const before = new Date(after);

  before.setFullYear(before.getFullYear() + 1);
  before.setMilliseconds(-1);

  return (
    <div className="mt-6 ml-(--gutter-left) mr-(--gutter-right)">
      <Explorer
        type="post"
        date={{ after, before }}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
