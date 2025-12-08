"use client";

import { useContext } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuLinkSeparator,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  BookmarkIcon,
  BookOpenIcon,
  BoomBoxIcon,
  CassetteTapeIcon,
  CompassIcon,
  EarthIcon,
  HeadsetIcon,
  InfoIcon,
  MailIcon,
  MessageCircleQuestionIcon,
  PodcastIcon,
  RadioTowerIcon,
  ShieldUserIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import MainUIContext from "../../_contexts/MainUIContext";
import LogoGlobe from "../Logo/LogoGlobe";

export default function MiniMenu() {
  const { isMenuOpen } = useContext(MainUIContext);

  return (
    <NavigationMenu
      aria-label="Mini Nav"
      orientation="vertical"
      viewport={false}
      inert={isMenuOpen}
    >
      <NavigationMenuList size="compact">
        {/* Mini Menu Item w/ Submenu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger indicator={false}>
            <HeadsetIcon className="size-8" />
            <span>Listen</span>
          </NavigationMenuTrigger>

          <NavigationMenuContent className="grid justify-stretch gap-y-1 py-2 [&>a]:mr-1.5 min-w-50">
            <NavigationMenuLink asChild>
              <Link href="/podcasts">
                <PodcastIcon /> Podcasts
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild>
              <Link href="/stations">
                <RadioTowerIcon /> Station Finder
              </Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/newsletter">
              <MailIcon /> Newsletter
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger indicator={false}>
            <CompassIcon className="size-8" />
            <span>Explore</span>
          </NavigationMenuTrigger>

          <NavigationMenuContent className="grid justify-stretch gap-y-1 py-2 [&>a]:mr-1.5 min-w-50">
            <NavigationMenuLink asChild>
              <Link href="/episodes">
                <BoomBoxIcon /> Episodes
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild>
              <Link href="/segments">
                <CassetteTapeIcon /> Segments
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild>
              <Link href="/episodes">
                <BookOpenIcon /> Stories
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLinkSeparator from="end" className="my-1" />

            <NavigationMenuLink asChild>
              <Link href="/categories">
                <BookmarkIcon /> By Category
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild>
              <Link href="/countries">
                <EarthIcon /> By Country
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild>
              <Link href="/contributors">
                <UserIcon /> By Contributor
              </Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger indicator={false}>
            <InfoIcon className="size-8" />
            <span>Info</span>
          </NavigationMenuTrigger>

          <NavigationMenuContent className="grid justify-stretch gap-y-1 py-2 [&>a]:mr-1.5 min-w-50">
            <NavigationMenuLink asChild>
              <Link href="/about">
                <LogoGlobe /> About
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild>
              <Link href="/team">
                <UsersIcon /> The Team
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link href="/contact-us">
                <MessageCircleQuestionIcon /> Contact
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link href="/privacy-policy">
                <ShieldUserIcon /> Privacy
              </Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
