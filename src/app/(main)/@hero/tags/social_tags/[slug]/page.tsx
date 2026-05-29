import { HashIcon } from "lucide-react";
import { HtmlContent } from "@/components/HtmlContent";
import { getCachedSocialTag } from "@/app/(main)/tags/social_tags/[slug]/page";
import { taxonomySlugToSingularName } from "@/lib/map/taxonomy";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";

export default async function SocialTagHero({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  const isTaxonomySlug = taxonomySlugToSingularName.has(slug);
  let data: Awaited<ReturnType<typeof getCachedSocialTag>>;

  if (slug && !isTaxonomySlug) {
    data = await getCachedSocialTag(slug);
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
          <HashIcon />
          <span>{name}</span>
        </ExplorerHeroHeading>
        {hasDescription && <HtmlContent html={description} />}
      </div>
    </ExplorerHero>
  );
}
