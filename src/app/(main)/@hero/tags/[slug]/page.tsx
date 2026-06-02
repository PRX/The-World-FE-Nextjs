import { BookmarkIcon } from "lucide-react";
import { HtmlContent } from "@/components/HtmlContent";
import { getCachedTag } from "@/app/(main)/tags/[slug]/page";
import { taxonomySlugToSingularName } from "@/lib/map/taxonomy";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";

export default async function TagHero({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  const isTaxonomySlug = taxonomySlugToSingularName.has(slug);
  let data: Awaited<ReturnType<typeof getCachedTag>>;

  if (slug && !isTaxonomySlug) {
    data = await getCachedTag(slug);
  }

  if (!data) {
    return null;
  }

  const { name, description, taxonomyImages } = data;
  const { imageBanner } = taxonomyImages || {};
  const hasDescription = !!description?.trim();

  return (
    <ExplorerHero image={imageBanner?.node}>
      <div className="grid gap-y-4 max-w-3xl text-pretty">
        <ExplorerHeroHeading>
          <BookmarkIcon />
          <span>{name}</span>
        </ExplorerHeroHeading>
        {hasDescription && <HtmlContent html={description} />}
      </div>
    </ExplorerHero>
  );
}
