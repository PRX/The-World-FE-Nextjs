import type { Category } from "@/interfaces";
import { getCachedCategory } from "@/app/(main)/categories/[[...slugs]]/page";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { HtmlContent } from "@/components/HtmlContent";
import { BookmarkIcon } from "lucide-react";

export default async function CategoryHero({
  params,
}: {
  params: Promise<{ slugs: string | string[] }>;
}) {
  const { slugs } = await params;
  const slug = slugs && (typeof slugs === "string" ? slugs : slugs.pop());
  let data: Category | undefined;

  if (slug) {
    data = await getCachedCategory(slug);
  }

  if (!data) {
    return null;
  }

  const { name, description, taxonomyImages, teaserFields } = data;
  const { teaser } = teaserFields || {};
  const { imageBanner } = taxonomyImages || {};
  const hasDescription = !!description?.trim();
  const hasTeaser = !!teaser?.trim();

  return (
    <HeroHeader
      image={imageBanner}
      classes={{ content: "max-w-none mx-0 px-8" }}
    >
      <div className="grid gap-y-4 max-w-3xl text-pretty">
        <h1 className="flex gap-4 items-center capitalize text-3xl md:text-4xl font-bold text-balance">
          <BookmarkIcon className="size-9" /> {name}
        </h1>
        {hasTeaser && !hasDescription && <p>{teaser}</p>}
        {hasDescription && <HtmlContent html={description} />}
      </div>
    </HeroHeader>
  );
}
