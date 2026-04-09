import { taxonomySlugToSingularName } from "@/lib/map/taxonomy";
import { getCachedContributor } from "@/app/(main)/contributors/[slug]/page";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/util/css";
import Link from "next/link";
import { generateContentLinkHref } from "@/lib/routing";
import {
  GlobeIcon,
  LinkIcon,
  MailIcon,
  PodcastIcon,
  RssIcon,
} from "lucide-react";
import FacebookIcon from "@/assets/svg/icons/brands/facebook.svg";
import InstagramIcon from "@/assets/svg/icons/brands/instagram.svg";
import BlueskyIcon from "@/assets/svg/icons/brands/bluesky.svg";
import TwitterXIcon from "@/assets/svg/icons/brands/twitter.svg";
import TumblrIcon from "@/assets/svg/icons/brands/tumblr.svg";
import TiktokIcon from "@/assets/svg/icons/brands/tiktok.svg";
import { Button } from "@/components/ui/button";
import { capitalize } from "lodash";
import { ColorSchemeSwitcher } from "@/app/(main)/_components/ColorSchemeSwitcher";

const followIconMap = new Map();
followIconMap.set("blog", LinkIcon);
followIconMap.set("email", MailIcon);
followIconMap.set("facebook", FacebookIcon);
followIconMap.set("instagram", InstagramIcon);
followIconMap.set("podcast", PodcastIcon);
followIconMap.set("rss", RssIcon);
followIconMap.set("tiktok", TiktokIcon);
followIconMap.set("tumblr", TumblrIcon);
followIconMap.set("twitter", TwitterXIcon);
followIconMap.set("bluesky", BlueskyIcon);
followIconMap.set("website", GlobeIcon);

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

  const { name, taxonomyImages, contributorDetails, contributorSocialLinks } =
    data;
  const { image, position, program } = contributorDetails || {};
  const imageSrc = image?.sourceUrl || image?.mediaItemUrl;
  const initials = name
    ?.match(/\b(\w)/g)
    ?.join("")
    .toUpperCase();
  const { name: programName, link: programLink } = program?.at(0) || {};
  const programHref = generateContentLinkHref(programLink);
  const { imageBanner } = taxonomyImages || {};
  const hasPosition = !!position?.trim().length;

  const followLinks =
    contributorSocialLinks &&
    Object.entries(contributorSocialLinks)
      .filter(([k, v]) => !!v && followIconMap.has(k))
      .map(([k, v]) => {
        const Icon = followIconMap.get(k) || <LinkIcon />;
        return (
          v && (
            <Button
              key={`${k}:${v}`}
              title={capitalize(k)}
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href={v} target="_blank">
                <Icon />
              </Link>
            </Button>
          )
        );
      });

  return (
    <ExplorerHero image={imageBanner}>
      <div className="grid md:grid-cols-[--spacing(50)_1fr] gap-8 items-end">
        <Avatar
          className={cn(
            "row-span-full relative size-50 border-10 border-transparent bg-current/10 bg-clip-border backdrop-blur-md backdrop-brightness-125",
          )}
        >
          {imageSrc && (
            <AvatarImage
              src={imageSrc}
              sizes="400px"
              alt={image?.altText || name || ""}
            />
          )}
          <AvatarFallback className="text-3xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-4 content-start">
          <div className="grid gap-1">
            <ExplorerHeroHeading className="text-5xl">
              <span>{name}</span>
            </ExplorerHeroHeading>
            <div className="text-xl/none font-light [&>*+*]:before:content-['\2022'] [&>*+*]:before:mx-1">
              {hasPosition && <span>{position}</span>}
              {programHref && <Link href={programHref}>{programName}</Link>}
            </div>
          </div>
          <div className="flex justify-between items-center">
            {!!followLinks?.length && (
              <div className="flex gap-1 self-end">{followLinks}</div>
            )}
            <ColorSchemeSwitcher />
          </div>
        </div>
      </div>
    </ExplorerHero>
  );
}
