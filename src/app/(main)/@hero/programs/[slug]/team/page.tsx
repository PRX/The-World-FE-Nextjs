import HeroHeader from "@/app/(main)/_components/HeroHeader";

export default async function TaxonomyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <HeroHeader className="ml-(--gutter-left) mr-(--gutter-right) px-8">
      <h1 className="text-2xl capitalize">
        {slug.replaceAll(/[-_]+/g, " ")} Team
      </h1>
    </HeroHeader>
  );
}
