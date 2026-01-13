import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { UserIcon } from "lucide-react";
import { HtmlContent } from "@/components/HtmlContent";
import { taxonomySlugToSingularName } from "@/lib/map/taxonomy";
import { getCachedContributor } from "@/app/(main)/contributors/[slug]/page";

export default async function ContributorHero({
  params,
}: {
  params: Promise<Record<"slug", string>>;
}) {
  const { slug } = await params;
  const isTaxonomySlug = taxonomySlugToSingularName.has(slug);
  let data: Awaited<ReturnType<typeof getCachedContributor>>;

  if (slug && !isTaxonomySlug) {
    data = await getCachedContributor(slug);
  }

  if (!data) {
    return null;
  }

  const { name, description, taxonomyImages, contributorDetails } = data;
  const { bio, teaser } = contributorDetails || {};
  const { imageBanner } = taxonomyImages || {};
  const hasTeaser = !!teaser?.trim();
  const hasDescription = !!description?.trim();
  const hasBio = !!bio?.trim();

  return (
    <HeroHeader image={imageBanner} classes={{ content: "max-w-5xl px-8" }}>
      <div className="grid gap-y-4 text-pretty">
        <h1 className="flex gap-4 items-center capitalize text-3xl md:text-4xl font-bold text-balance">
          <UserIcon className="size-9" /> {name}
        </h1>
        {hasTeaser && <p className="text-lg">{teaser}</p>}
        {hasDescription && hasBio && <HtmlContent html={description} />}
      </div>
    </HeroHeader>
  );
}
