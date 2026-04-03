import type { Program, Contributor } from "@/interfaces";
import { getCachedProgram } from "@/app/(main)/programs/[slug]/page";
import { HtmlContent } from "@/components/HtmlContent";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { generateContentLinkHref } from "@/lib/routing";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/util/css";

export default async function ProgramHero({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: Program | undefined;

  if (slug) {
    data = await getCachedProgram(slug);
  }

  if (!data) {
    return null;
  }

  const {
    name,
    description,
    taxonomyImages,
    teaserFields,
    programContributors,
    sponsorship,
  } = data;
  const { teaser } = teaserFields || {};
  const { imageBanner, logo } = taxonomyImages || {};
  const { hosts, team } = programContributors || {};
  const hasContributors = !!hosts?.length || !!team?.length;
  const { collectionSponsorLinks } = sponsorship || {};
  const sponsorLinks = collectionSponsorLinks
    ?.filter((v) => !!v)
    .map(({ sponsorLinks }) => sponsorLinks);
  const hasDescription = !!description?.trim();
  const hasTeaser = !!teaser?.trim();
  const hasSponsors = !!sponsorLinks?.length;
  const logoSrc = logo?.sourceUrl || logo?.mediaItemUrl;

  return (
    <ExplorerHero image={imageBanner}>
      <div className="grid gap-y-4 text-lg text-pretty">
        <div className="flex items-end @max-xl/hero-content:flex-wrap content-start gap-x-12 gap-y-4">
          <div className="grow flex flex-col gap-y-4">
            {logoSrc && (
              <Avatar className={cn("relative size-20 ring-6 ring-current/20")}>
                <AvatarImage
                  src={logoSrc}
                  sizes="400px"
                  alt={logo?.altText || name || ""}
                />
              </Avatar>
            )}
            <ExplorerHeroHeading>
              <span>{name}</span>
            </ExplorerHeroHeading>
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

                    return url ? (
                      <Link href={url} target="_blank" key={url}>
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
          {hasContributors && (
            <div className="flex flex-col gap-4">
              {!!hosts?.length && (
                <div className="flex flex-col gap-2">
                  <h3 className="font-light">Hosted By</h3>
                  <div className="flex @max-xl/hero-content:flex-wrap @xl/hero-content:flex-col gap-2">
                    {hosts
                      .filter((v) => !!v)
                      .map((contributor: Contributor) => {
                        const {
                          id: key,
                          name,
                          link,
                          contributorDetails,
                        } = contributor;
                        const { image } = contributorDetails || {};
                        const { sourceUrl, mediaItemUrl, altText } =
                          image || {};
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
                                  <AvatarImage
                                    sizes="120px"
                                    src={imageUrl}
                                    alt={altText || ""}
                                  />
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
              {!!team?.length && (
                <div className="flex flex-col gap-2">
                  <h3 className="font-light">{name} Team</h3>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-fit h-auto p-2 rounded-full"
                    asChild
                  >
                    <Link href={`/programs/${slug}/team`}>
                      <AvatarGroup
                        className={cn(
                          "justify-start rounded-full ps-0",
                          "*:ring-background **:data-[slot=avatar-fallback]:bg-background",
                          "*:nth-[5n+1]:[--background:var(--color-light-blue)]",
                          "*:nth-[5n+2]:[--background:var(--color-cyan)]",
                          "*:nth-[5n+3]:[--background:var(--color-orange)]",
                          "*:nth-[5n+4]:[--background:var(--color-purple)]",
                          "**:data-[slot=avatar-fallback]:text-white",
                        )}
                      >
                        {team
                          .filter((v) => !!v)
                          .filter((t) => !hosts?.find((h) => t.id === h?.id))
                          .slice(0, 4)
                          .map((contributor: Contributor) => {
                            const {
                              id: key,
                              name: contributorName,
                              contributorDetails,
                            } = contributor;
                            const { image } = contributorDetails || {};
                            const { sourceUrl, mediaItemUrl, altText } =
                              image || {};
                            const imageUrl = sourceUrl || mediaItemUrl;
                            const initials = contributorName
                              ?.match(/\b(\w)/g)
                              ?.join("")
                              .toUpperCase();

                            return (
                              <Avatar size="lg" key={key}>
                                {imageUrl && (
                                  <AvatarImage
                                    sizes="120px"
                                    src={imageUrl}
                                    alt={altText || ""}
                                  />
                                )}
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                            );
                          })}
                        <AvatarGroupCount>+{team.length - 4}</AvatarGroupCount>
                      </AvatarGroup>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ExplorerHero>
  );
}
