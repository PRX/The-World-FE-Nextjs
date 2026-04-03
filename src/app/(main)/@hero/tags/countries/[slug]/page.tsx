import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { BookmarkIcon } from "lucide-react";
import { HtmlContent } from "@/components/HtmlContent";
import { getCachedCountry } from "@/app/(main)/tags/countries/[slug]/page";
import { taxonomySlugToSingularName } from "@/lib/map/taxonomy";

export default async function TagHero({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  const isTaxonomySlug = taxonomySlugToSingularName.has(slug);
  let data: Awaited<ReturnType<typeof getCachedCountry>>;

  if (slug && !isTaxonomySlug) {
    data = await getCachedCountry(slug);
  }

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
      <div className="grid gap-y-4 max-w-3xl text-pretty">
        <h1 className="flex gap-4 items-center capitalize text-3xl md:text-4xl font-bold text-balance">
          <BookmarkIcon className="size-9" />
          <span>{name}</span>
        </h1>
        {hasDescription && <HtmlContent html={description} />}
      </div>
    </HeroHeader>
  );
}
