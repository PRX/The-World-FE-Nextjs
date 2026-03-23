"use client";

import type { AppMenus, Settings } from "@/interfaces";
import { ChevronUpIcon, HeartHandshakeIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import React, {
  type CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/util/css";
import Logo from "../Logo/Logo";
import "./MainUI.css";
import { useBreakpoint } from "@react-awesome/use-breakpoint";
import { usePathname } from "next/navigation";
import DonateModalLink from "@/components/Donate/DonateModalLink";
import CcnLogo from "@/assets/svg/logos/CCN-Logo.svg";
import GbhLogo from "@/assets/svg/logos/GBH-Logo.svg";
import ProgressiveLogo from "@/assets/svg/logos/Progressive-Logo.svg";
import PrxLogo from "@/assets/svg/logos/PRX-Logo-Horizontal.svg";
import MainUIContext from "../../_contexts/MainUIContext";
import MainUIFooterLogoGroup from "./MainUIFooterLogoGroup";
import { Toaster } from "@/components/ui/sonner";
import MainUIMenu from "./MainUIMenu";
import { NavigationMenuLinkSeparator } from "@/components/ui/navigation-menu";
import {
  AutoplayButton,
  ForwardButton,
  NextButton,
  PlayButton,
  PlayerContext,
  Playlist,
  PlayerMenu,
  PlayerProgress,
  PreviousButton,
  ReplayButton,
  TimeInfo,
  TrackInfo,
  VolumeControls,
} from "@/components/Player";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";

export default function MainUI({
  children,
  browser,
  hero,
  search,
  siteBanner,
  menus,
  settings,
}: Readonly<{
  children: React.ReactNode;
  browser: React.ReactNode;
  hero: React.ReactNode;
  search: React.ReactNode;
  siteBanner: React.ReactNode;
  menus: AppMenus;
  settings?: Settings;
}>) {
  const { footerNav } = menus || {};
  const pathname = usePathname();
  const { greaterOrEqual } = useBreakpoint();
  const isDesktopLayout = greaterOrEqual("md");
  const headerRef = useRef<HTMLDivElement>(null);
  const topNavRef = useRef<HTMLDivElement>(null);
  const uiBottomRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const trackInfoRef = useRef<HTMLDivElement>(null);
  const { state: playerState } = useContext(PlayerContext);
  const { tracks } = playerState;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(true);
  const [hasBrowser, setHasBrowser] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(62);
  const [gutters, setGutters] = useState({
    top: 16,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const styles = `
    :root {
      --gutter-top: calc(var(--spacing)*${gutters.top});
      --gutter-right: calc(var(--spacing)*${gutters.right});
      --gutter-bottom: calc(var(--spacing)*${gutters.bottom});
      --gutter-left: calc(var(--spacing)*${gutters.left});
      --ui-drawer--width: calc(var(--spacing)*${drawerWidth});
    }
    body {
      transition-property: --gutter-top, --gutter-bottom, --gutter-left, --gutter-right, --ui-drawer--width;
      transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
      transition-duration: var(--tw-duration, var(--default-transition-duration));
    }`;

  const updateGutters = useCallback(() => {
    // This can be called by descendent components after they change their local state.
    // Need to delay the update till after the next render to account for layout changes.
    // Divide pixel values by 4 to convert to spacing units.
    setTimeout(() => {
      const headerRefHeight =
        headerRef.current?.getBoundingClientRect().height || 0;

      setGutters((current) => ({
        ...current,
        left: !isMenuOpen || !isDesktopLayout ? 0 : drawerWidth,
        ...(uiBottomRef.current && {
          bottom: isPlayerOpen
            ? uiBottomRef.current?.getBoundingClientRect().height / 4
            : 0,
        }),
        ...(headerRefHeight
          ? {
              top: headerRefHeight / 4,
            }
          : {
              top: (topNavRef.current?.getBoundingClientRect().height || 0) / 4,
            }),
      }));
    }, 0);
  }, [drawerWidth, isDesktopLayout, isMenuOpen, isPlayerOpen]);

  function handleMenuClick() {
    setIsMenuOpen((isOpen) => !isOpen);
    updateGutters();
  }

  function handlePlaylistToggle() {
    setIsPlaylistOpen((c) => !c);
  }

  useEffect(() => {
    if (tracks?.length <= 1) {
      setIsPlaylistOpen(false);
    }
  }, [tracks?.length]);

  useEffect(() => {
    if (hasBrowser) {
      setDrawerWidth((isMenuExpanded ? 62 : 12) + 2 + 62);
    } else {
      setDrawerWidth(62);
    }
    updateGutters();
  }, [isMenuExpanded, hasBrowser, updateGutters]);

  useEffect(() => {
    function handleResize() {
      updateGutters();
    }

    function handlePlayerOpen() {
      setIsPlayerOpen(true);
      updateGutters();
    }

    function handlePlayerClose() {
      setIsPlayerOpen(false);
      updateGutters();
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("player-open", handlePlayerOpen); // TODO: This may come from the Player Context.
    window.addEventListener("player-close", handlePlayerClose); // TODO: This may come from the Player Context.

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("player-open", handlePlayerOpen);
      window.removeEventListener("player-close", handlePlayerClose);
    };
  }, [updateGutters]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Scroll to top when route changes.
  useEffect(() => {
    const { childElementCount } = drawerRef.current || {};

    setHasBrowser(!!childElementCount && childElementCount > 1);

    updateGutters();
  }, [pathname, updateGutters]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Scroll to top when route changes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <MainUIContext.Provider
      value={{
        isMenuOpen,
        isMenuExpanded,
        hasBrowser,
        updateGutters,
        menus,
        settings,
      }}
    >
      <style>{styles}</style>
      <Toaster />
      <div
        className="group/ui flex flex-col min-h-dvh transition-[--gutter-left,--gutter-right]"
        {...(isMenuOpen && { "data-menu-open": true })}
        {...(isPlayerOpen && { "data-player-open": true })}
      >
        <div
          className={cn(
            "fixed inset-0 bottom-auto h-(--gutter-top) z-(--z-ui) bg-navy-blue/30 backdrop-blur-lg mask-b-from-[calc(100%-(var(--spacing)*16))]",
            "max-md:hidden",
          )}
        ></div>
        <div
          ref={headerRef}
          className={cn(
            "contents z-(--z-ui)",
            "md:grid md:fixed md:bottom-full md:translate-y-(--gutter-top)",
          )}
        >
          <div
            id="site-banner"
            className={cn(
              "z-(--z-ui) empty:hidden bg-linear-to-b from-light-blue/30 to-transparent",
              "md:p-4",
            )}
          >
            {siteBanner}
          </div>
          <div
            ref={topNavRef}
            className="isolate sticky top-0 z-(--z-ui) flex justify-between gap-x-10 w-screen p-3"
          >
            <div className="absolute md:hidden inset-0 -z-1 bg-navy-blue/30 backdrop-blur-lg mask-b-from-60%"></div>
            <h1 className="flex items-center gap-2">
              <button
                type="button"
                className="p-1 cursor-pointer"
                onClick={handleMenuClick}
                aria-label="Main Menu"
                aria-haspopup="true"
                aria-controls="main-menu"
                aria-expanded={isMenuOpen}
              >
                <MenuIcon />
              </button>
              <Link href="/">
                <Logo
                  className="max-h-10 max-w-[40vw]"
                  animated
                  duration="10s"
                />
              </Link>
            </h1>
            <span className="basis-xl">{search}</span>
            <span>
              <DonateModalLink campaign="731684" size="lg" variant="action">
                <HeartHandshakeIcon aria-label="Donate" />
                <span className="hidden md:inline" aria-hidden>
                  Donate
                </span>
              </DonateModalLink>
            </span>
          </div>
        </div>

        <div
          id="main-menu"
          role="menu"
          aria-labelledby="main-menu-button"
          className={cn(
            "fixed inset-0 flex flex-col justify-stretch transition-transform z-(--z-dialog) bg-linear-to-r from-blue to-green",
            "md:top-(--gutter-top) md:bottom-(--gutter-bottom) md:right-auto md:w-min md:z-(--z-ui) md:bg-none md:delay-(--default-transition-duration)",
            "md:before:absolute md:before:inset-0 md:before:-z-1 md:before:pointer-events-none md:before:bg-navy-blue/30 md:before:backdrop-blur-lg md:before:mask-r-from-70%",
            isMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
          inert={!isMenuOpen}
        >
          {/* Header */}
          <div className="top-0 p-3 md:hidden">
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="main-menu-button-mobile"
                className="p-1 cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false);
                  updateGutters();
                }}
                aria-label="Close Menu"
              >
                <MenuIcon />
              </button>
              <Link href="/">
                <Logo animated duration="10s" />
              </Link>
            </div>
          </div>

          {/* Tag Line */}
          <div className="p-4 text-base/5 max-w-62">
            <p>Public radio’s longest-running daily global news program.</p>
          </div>

          <NavigationMenuLinkSeparator />

          {/* Menu and Browser */}
          <div
            ref={drawerRef}
            className={cn(
              "grow relative grid grid-cols-1 gap-x-2 overflow-hidden",
              "md:w-(--ui-drawer--width)",
              {
                "max-md:*:nth-[n+2]:hidden": hasBrowser,
                "md:grid-cols-[1fr_calc(var(--spacing)*62)]": hasBrowser,
              },
            )}
            onPointerLeave={() => {
              setIsMenuExpanded(false);
            }}
          >
            <div
              className={cn(
                "overflow-x-hidden overflow-y-auto no-scrollbar transition-all",
              )}
              onPointerEnter={() => {
                setIsMenuExpanded(true);
              }}
            >
              <MainUIMenu />
            </div>

            {browser}
          </div>

          <NavigationMenuLinkSeparator />

          {/* Footer */}
          <div className="grid gap-2 p-4 text-xs/4 max-w-62">
            {footerNav && (
              <nav className="flex flex-wrap gap-x-2">
                {footerNav.map(({ key, url, label, attributes }) => (
                  <Link
                    className="hover:underline underline-offset-2"
                    href={url.replace(/^https?:\/\/(www\.)?theworld\.org/i, "")}
                    key={key}
                    {...attributes}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            )}
            <div>
              <p>©2025 The World from PRX</p>
              <p>
                PRX is a 501(c)(3) organization recognized by the IRS:
                #263347402.
              </p>
            </div>
          </div>
        </div>

        <div
          ref={uiBottomRef}
          className={cn(
            "fixed inset-0 top-auto transition-transform z-(--z-ui-player)",
            isPlayerOpen ? "translate-y-0" : "translate-y-full",
          )}
          inert={!isPlayerOpen}
        >
          <div
            className={cn(
              "relative flex items-center gap-x-6 pt-4 px-4 pb-3 bg-navy-blue/80 bg-linear-to-l from-purple/60 backdrop-blur-md pointer-events-auto",
              "max-sm:justify-between max-sm:gap-x-1 max-sm:px-1",
            )}
          >
            <div className="absolute inset-0 bottom-auto">
              <PlayerProgress />
            </div>
            {/* Playback Controls */}
            <div className={cn("flex items-center gap-1")}>
              <ReplayButton />
              <PlayButton />
              <ForwardButton />
            </div>
            <TimeInfo className="text-sm" />
            {/* Track Info */}
            <div className="grow flex justify-start items-center gap-x-4 max-sm:justify-between max-md:gap-x-1">
              <div className="flex items-center gap-x-2">
                <div className="max-md:hidden">
                  <TrackInfo ref={trackInfoRef} />
                </div>
                {tracks.length > 1 && (
                  <Drawer open={isPlaylistOpen} handleOnly>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="rounded-full cursor-pointer"
                          size="icon"
                          variant="ghost"
                          onClick={handlePlaylistToggle}
                        >
                          <ChevronUpIcon
                            className={cn("transition-transform", {
                              "rotate-180": isPlaylistOpen,
                            })}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="z-(--z-ui-player)">
                        {isPlaylistOpen ? "Hide" : "Show"} Playlist
                      </TooltipContent>
                    </Tooltip>
                    <DrawerContent
                      handle={false}
                      style={
                        {
                          "--padding-left": `${trackInfoRef.current?.getBoundingClientRect().left}px`,
                        } as CSSProperties
                      }
                      className={cn(
                        "h-full flex justify-end",
                        "bottom-(--gutter-bottom)! pl-(--padding-left) mask-t-from-[calc(100%-10rem)]",
                        "bg-transparent border-none",
                        "bg-linear-to-tr from-green/60 to-blue/40",
                      )}
                    >
                      <DrawerTitle className="sr-only">Playlist</DrawerTitle>
                      <DrawerDescription className="sr-only">
                        Your currently queued episodes.
                      </DrawerDescription>
                      <Playlist className="pt-28 pb-4 md:-ml-13" />
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
              <PlayerMenu
                triggerProps={{ className: "max-sm:hidden" }}
                contentProps={{ className: "z-(--z-ui-player)" }}
              />
              {/* Track Selection Controls */}
              <div
                className={cn(
                  "flex justify-start items-center gap-1 empty:hidden",
                )}
              >
                <PreviousButton />
                <NextButton />
              </div>
            </div>
            {/* Player Settings */}
            <div className="flex justify-end items-center gap-x-4 max-sm:hidden">
              <VolumeControls className="hidden md:media-hover:flex lg:flex" />
              <AutoplayButton />
            </div>
          </div>
        </div>

        <div className="grow">
          {hero}

          {children}
        </div>

        <footer className="grid justify-items-center gap-16 py-20 ml-(--gutter-left) mb-(--gutter-bottom)">
          <div className="flex flex-wrap justify-center gap-x-20 gap-y-10">
            <MainUIFooterLogoGroup heading="Produced By">
              <PrxLogo aria-label="PRX" />
              <GbhLogo data-color="inherit" aria-label="GBH" />
            </MainUIFooterLogoGroup>

            <MainUIFooterLogoGroup heading="Thanks To Our Sponsor">
              <ProgressiveLogo aria-label="Progressive Insurance" />
            </MainUIFooterLogoGroup>
          </div>

          <MainUIFooterLogoGroup heading="Major Funders">
            <CcnLogo
              className="h-18!"
              aria-label="Carnegie Corporation of New York"
            />
          </MainUIFooterLogoGroup>
        </footer>
      </div>
    </MainUIContext.Provider>
  );
}
