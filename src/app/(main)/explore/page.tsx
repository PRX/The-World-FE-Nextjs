import Explorer from "@/app/(main)/_components/Explorer/Explorer";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="mt-10 ml-(--gutter-left) mr-(--gutter-right)">
      <Explorer searchParams={resolvedSearchParams} />
    </div>
  );
}
