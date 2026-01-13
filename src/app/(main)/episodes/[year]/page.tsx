import { redirectToValidDatedRoute } from "@/lib/routing/redirectToValidDatedRoute";
import Explorer from "@/app/(main)/_components/Explorer";

export default async function EpisodesByYearPage({
  params,
  searchParams,
}: {
  params: Promise<Record<"year", string>>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { year } = await params;
  const resolvedSearchParams = await searchParams;

  redirectToValidDatedRoute("/episodes", { year }, resolvedSearchParams);

  return (
    <div className="mt-6 ml-(--gutter-left) mr-(--gutter-right)">
      <Explorer
        type="episode"
        year={year}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
