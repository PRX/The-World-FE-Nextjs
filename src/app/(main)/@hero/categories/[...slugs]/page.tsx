import type { Category, Contributor } from "@/interfaces";
import { getCachedCategory } from "@/app/(main)/categories/[...slugs]/page";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { HtmlContent } from "@/components/HtmlContent";
import { BookmarkIcon } from "lucide-react";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { generateContentLinkHref } from "@/lib/routing";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/util/css";

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

  const {
    name,
    description,
    taxonomyImages,
    teaserFields,
    categoryEditors,
    sponsorship,
  } = data;
  const { teaser } = teaserFields || {};
  const { imageBanner } = taxonomyImages || {};
  const { editors } = categoryEditors || {};
  const { collectionSponsorLinks } = sponsorship || {};
  const sponsorLinks = collectionSponsorLinks
    ?.filter((v) => !!v)
    .map(({ sponsorLinks }) => sponsorLinks);
  const hasDescription = !!description?.trim();
  const hasTeaser = !!teaser?.trim();
  const hasSponsors = !!sponsorLinks?.length;

  return (
    <ExplorerHero image={imageBanner}>
      <div className="grid gap-y-4 text-lg text-pretty">
        <ExplorerHeroHeading>
          <BookmarkIcon />
          <span>{name}</span>
        </ExplorerHeroHeading>
        <div className="flex @max-xl/hero-content:flex-wrap content-start gap-x-12 gap-y-4">
          <div className="grow flex flex-col gap-y-4">
            {hasTeaser && !hasDescription && <p>{teaser}</p>}
            {hasDescription && <HtmlContent html={description} />}
            {hasSponsors && (
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-lg">
                <h3 className="font-light whitespace-nowrap">Supported By</h3>
                <div
                  className={cn(
                    "grow flex flex-wrap items-center overflow-clip",
                    "leading-tight font-semibold",
                    "*:not-last:after:content-['•'] *:after:mx-[1ch]",
                  )}
                >
                  {sponsorLinks.map((sl) => {
                    const { title, url } = sl || {};
                    const linkHref = generateContentLinkHref(url);

                    return linkHref ? (
                      <Link href={linkHref} key={url}>
                        {title}
                      </Link>
                    ) : (
                      <span key={url}>{title}</span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {!!editors?.length && (
            <div className="flex flex-col gap-2">
              <h3 className="font-light">Edited By</h3>
              <div className="flex @max-xl/hero-content:flex-wrap @xl/hero-content:flex-col gap-2">
                {editors
                  .filter((v) => !!v)
                  .map((contributor: Contributor) => {
                    const {
                      id: key,
                      name,
                      link,
                      contributorDetails,
                    } = contributor;
                    const { image } = contributorDetails || {};
                    const { sourceUrl, mediaItemUrl, altText } = image || {};
                    const imageUrl = sourceUrl || mediaItemUrl;
                    const initials = name
                      ?.match(/\b(\w)/g)
                      ?.join("")
                      .toUpperCase();
                    const href = generateContentLinkHref(link) || "";

                    return (
                      <Button
                        className={cn(
                          "justify-start rounded-full ps-0",
                          "**:data-[slot=avatar-fallback]:text-white",
                          "nth-of-type-[5n+1]:**:data-[slot=avatar]:bg-dark-green",
                          "nth-of-type-[5n+2]:**:data-[slot=avatar]:bg-purple",
                          "nth-of-type-[5n+3]:**:data-[slot=avatar]:bg-red",
                          "nth-of-type-[5n+4]:**:data-[slot=avatar]:bg-burnt-orange",
                          "nth-of-type-[5n+5]:**:data-[slot=avatar]:bg-blue",
                        )}
                        variant="ghost"
                        size="lg"
                        key={key}
                        asChild
                      >
                        <Link href={href}>
                          <Avatar size="lg">
                            {imageUrl && (
                              <AvatarImage src={imageUrl} alt={altText || ""} />
                            )}
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          {name}
                        </Link>
                      </Button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ExplorerHero>
  );
}
