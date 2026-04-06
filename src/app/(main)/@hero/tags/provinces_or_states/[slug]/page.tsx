import { Globe2Icon } from "lucide-react";
import { HtmlContent } from "@/components/HtmlContent";
import { getCachedProvinceOrState } from "@/app/(main)/tags/provinces_or_states/[slug]/page";
import { taxonomySlugToSingularName } from "@/lib/map/taxonomy";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";

export default async function ProvinceOrStateHero({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  const isTaxonomySlug = taxonomySlugToSingularName.has(slug);
  let data: Awaited<ReturnType<typeof getCachedProvinceOrState>>;

  if (slug && !isTaxonomySlug) {
    data = await getCachedProvinceOrState(slug);
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
