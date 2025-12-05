"use client";

import { useContext } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
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

const iconProps = { "aria-hidden": true };
const serviceIconMap = new Map<string | undefined, React.JSX.Element>();
serviceIconMap.set("facebook", <FacebookIcon {...iconProps} />);
serviceIconMap.set("instagram", <InstagramIcon {...iconProps} />);
serviceIconMap.set("bluesky", <BlueskyIcon {...iconProps} />);
serviceIconMap.set("twitter", <TwitterXIcon {...iconProps} />);
serviceIconMap.set("tiktok", <TikTokIcon {...iconProps} />);
serviceIconMap.set("youtube", <YoutubeIcon {...iconProps} />);

export default function MainUIMenu() {
  const { isMenuOpen, menus } = useContext(MainUIContext);
  const { socialsNav } = menus || {};

  return (
    <NavigationMenu
      aria-label="Main Nav"
      orientation="vertical"
      viewport={false}
      inert={!isMenuOpen}
    >
      <NavigationMenuList
        size="normal"
        className="grid gap-y-1 py-2 [&>li]:mx-2"
      >
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/podcasts">
              <PodcastIcon /> Podcasts
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/stations">
              <RadioTowerIcon /> Station Finder
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/newsletter">
              <MailIcon /> Newsletter
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <DonateModalLink variant="unstyled" campaign="731684">
              <HeartHandshakeIcon /> Donate
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
              <BoomBoxIcon /> Episodes
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/segments">
              <CassetteTapeIcon /> Segments
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/stories">
              <BookOpenIcon /> Stories
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
            <Link href="/taxonomy/category">
              <BookmarkIcon /> By Category
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/taxonomy/country">
              <Globe2Icon /> By Country
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/taxonomy/contributor">
              <UserIcon /> By Contributor
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
              <LogoGlobe /> About
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/team">
              <UsersIcon /> The Team
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/contact-us">
              <MessageCircleQuestionIcon /> Contact
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/privacy-policy">
              <ShieldUserIcon /> Privacy
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
                      {IconComponent || <ExternalLinkIcon />} {label}
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
