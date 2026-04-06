import { Globe2Icon } from "lucide-react";
import { HtmlContent } from "@/components/HtmlContent";
import { getCachedCountry } from "@/app/(main)/tags/countries/[slug]/page";
import { taxonomySlugToSingularName } from "@/lib/map/taxonomy";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";

export default async function CountryHero({
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
    <ExplorerHero image={imageBanner}>
      <div className="grid gap-y-4 max-w-3xl text-pretty">
        <ExplorerHeroHeading>
          <Globe2Icon />
          <span>{name}</span>
        </ExplorerHeroHeading>
        {hasDescription && <HtmlContent html={description} />}
      </div>
    </ExplorerHero>
  );
}
