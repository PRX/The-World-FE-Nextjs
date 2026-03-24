import Explorer from "@/app/(main)/_components/Explorer";

export default async function AllStoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="mt-6 ml-(--gutter-left) mr-(--gutter-right)">
      <Explorer
        options={{
          type: "post",
        }}
      />
    </div>
  );
}
