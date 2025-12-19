import { getCachedCategory } from "@/app/(main)/categories/[slug]/page";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { HtmlContent } from "@/components/HtmlContent";

export default async function ProgramHero({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCachedCategory(slug);

  if (!data) {
    return null;
  }

  const { name, description, taxonomyImages } = data;
  const { imageBanner } = taxonomyImages || {};
  const hasDescription = !!description?.trim();

  return (
    <HeroHeader
      image={imageBanner}
      classes={{ content: "max-w-none mx-0 px-8" }}
    >
      <div className="max-w-3xl">
        <h1 className="capitalize text-3xl md:text-4xl font-bold text-balance">
          {name}
        </h1>
        {hasDescription && <HtmlContent html={description} className="mt-2" />}
      </div>
    </HeroHeader>
  );
}
