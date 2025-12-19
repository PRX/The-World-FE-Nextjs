"use client";

import { type HTMLProps, useContext } from "react";
import NextLink, { type LinkProps } from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuLinkSeparator,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  BookmarkIcon,
  BookOpenIcon,
  BoomBoxIcon,
  CassetteTapeIcon,
  ExternalLinkIcon,
  Globe2Icon,
  HeartHandshakeIcon,
  MailIcon,
  MessageCircleQuestionIcon,
  PodcastIcon,
  RadioTowerIcon,
  ShieldUserIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import FacebookIcon from "@/assets/svg/icons/brands/facebook.svg";
import InstagramIcon from "@/assets/svg/icons/brands/instagram.svg";
import BlueskyIcon from "@/assets/svg/icons/brands/bluesky.svg";
import TwitterXIcon from "@/assets/svg/icons/brands/twitter.svg";
import TikTokIcon from "@/assets/svg/icons/brands/tiktok.svg";
import YoutubeIcon from "@/assets/svg/icons/brands/youtube.svg";
import MainUIContext from "../../_contexts/MainUIContext";
import DonateModalLink from "@/components/Donate/DonateModalLink";
import LogoGlobe from "../Logo/LogoGlobe";
import { usePathname } from "next/navigation";

const iconProps = { "aria-hidden": true };
const serviceIconMap = new Map<string | undefined, React.JSX.Element>();
serviceIconMap.set("facebook", <FacebookIcon {...iconProps} />);
serviceIconMap.set("instagram", <InstagramIcon {...iconProps} />);
serviceIconMap.set("bluesky", <BlueskyIcon {...iconProps} />);
serviceIconMap.set("twitter", <TwitterXIcon {...iconProps} />);
serviceIconMap.set("tiktok", <TikTokIcon {...iconProps} />);
serviceIconMap.set("youtube", <YoutubeIcon {...iconProps} />);

const Link = ({ href, ...props }: LinkProps & HTMLProps<HTMLAnchorElement>) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    href && (
      <NextLink
        href={href}
        className="NavigationMenuLink"
        {...props}
        data-active={isActive}
      />
    )
  );
};

export default function MainUIMenu() {
  const { isMenuOpen, isMenuExpanded, hasBrowser, menus } =
    useContext(MainUIContext);
  const { socialsNav } = menus || {};
  const isMenuCollapsed = hasBrowser && !isMenuExpanded;

  return (
    <NavigationMenu
      aria-label="Main Nav"
      orientation="vertical"
      viewport={false}
      inert={!isMenuOpen}
      data-collapsed={isMenuCollapsed}
    >
      <NavigationMenuList
        size="normal"
        className="grid gap-y-1 py-2 [&>li]:mx-2"
      >
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/podcasts">
              <PodcastIcon />
              <NavigationMenuLabel>Podcasts</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/stations">
              <RadioTowerIcon />
              <NavigationMenuLabel>Station Finder</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/newsletters/top-of-the-world">
              <MailIcon />
              <NavigationMenuLabel>Newsletter</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <DonateModalLink variant="unstyled" campaign="731684">
              <HeartHandshakeIcon />
              <NavigationMenuLabel>Donate</NavigationMenuLabel>
            </DonateModalLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuLinkSeparator className="my-1" />

      <NavigationMenuList
        size="normal"
        className="grid gap-y-1 py-2 [&>li]:mx-2"
      >
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/episodes">
              <BoomBoxIcon />
              <NavigationMenuLabel>Episodes</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/segments">
              <CassetteTapeIcon />
              <NavigationMenuLabel>Segments</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/stories">
              <BookOpenIcon />
              <NavigationMenuLabel>Stories</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuLinkSeparator className="my-1" />

      <NavigationMenuList
        size="normal"
        className="grid gap-y-1 py-2 [&>li]:mx-2"
      >
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/categories">
              <BookmarkIcon />
              <NavigationMenuLabel>By Category</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/countries">
              <Globe2Icon />
              <NavigationMenuLabel>By Country</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/contributors">
              <UserIcon />
              <NavigationMenuLabel>By Contributor</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuLinkSeparator className="my-1" />

      <NavigationMenuList
        size="normal"
        className="grid gap-y-1 py-2 [&>li]:mx-2"
      >
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/about">
              <LogoGlobe />
              <NavigationMenuLabel>About</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/programs/the-world/team">
              <UsersIcon />
              <NavigationMenuLabel>The Team</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/contact-us">
              <MessageCircleQuestionIcon />
              <NavigationMenuLabel>Contact</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/privacy-policy">
              <ShieldUserIcon />
              <NavigationMenuLabel>Privacy</NavigationMenuLabel>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      {!!socialsNav?.length && (
        <>
          <NavigationMenuLinkSeparator />
          <NavigationMenuList
            size="normal"
            className="grid gap-y-1 py-2 [&>li]:mx-2"
          >
            {socialsNav.map(({ key, url, label, service, attributes }) => {
              const IconComponent = serviceIconMap.get(service);
              return (
                <NavigationMenuItem key={key}>
                  <NavigationMenuLink asChild>
                    <Link href={url} {...attributes} target="_blank">
                      {IconComponent || <ExternalLinkIcon />}
                      <NavigationMenuLabel>{label}</NavigationMenuLabel>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </>
      )}
    </NavigationMenu>
  );
}
