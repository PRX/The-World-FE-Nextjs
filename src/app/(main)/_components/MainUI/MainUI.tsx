"use client";

import { HeartHandshakeIcon, MenuIcon, PlayIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { type CSSProperties, useEffect, useRef, useState } from "react";
import cn from "@/lib/util/css/cn";
import Logo from "../Logo/Logo";
import "./MainUI.css";
import { useBreakpoint } from "@react-awesome/use-breakpoint";
import { usePathname } from "next/navigation";
import DonateModalLink from "@/components/Donate/DonateModalLink";
import MainUIContext from "../../_contexts/MainUIContext";

export default function MainUI({
  children,
  browser,
}: Readonly<{
  children: React.ReactNode;
  browser: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { greaterOrEqual } = useBreakpoint();
  const isDesktopLayout = greaterOrEqual("md");
  const headerRef = useRef<HTMLDivElement>(null);
  const uiBottomRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [hasBrowser, setHasBrowser] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(62);
  const [gutters, setGutters] = useState({
    top: 14.5,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const styles = {
    "--gutter-top": `calc(var(--spacing)*${gutters.top})`,
    "--gutter-right": `calc(var(--spacing)*${gutters.right})`,
    "--gutter-bottom": `calc(var(--spacing)*${gutters.bottom})`,
    "--gutter-left": `calc(var(--spacing)*${gutters.left})`,
    "--ui-drawer--width": `calc(var(--spacing)*${drawerWidth})`,
  } as CSSProperties;

  function handleMenuClick() {
    setIsMenuOpen((isOpen) => !isOpen);
  }

  useEffect(() => {
    setGutters((current) => ({
      ...current,
      left: !isMenuOpen || !isDesktopLayout ? 0 : drawerWidth,
    }));
  }, [isDesktopLayout, isMenuOpen, drawerWidth]);

  useEffect(() => {
    if (hasBrowser) {
      setDrawerWidth((isMenuExpanded ? 62 : 12) + 2 + 62);
    } else {
      setDrawerWidth(62);
    }
  }, [isMenuExpanded, hasBrowser]);

  useEffect(() => {
    setGutters((current) => ({
      ...current,
      ...(uiBottomRef.current && {
        bottom: isPlayerOpen
          ? uiBottomRef.current?.getBoundingClientRect().height / 4
          : 0,
      }),
    }));
  }, [isPlayerOpen]);

  useEffect(() => {
    setGutters((current) => ({
      ...current,
      ...(headerRef.current && {
        top: headerRef.current?.getBoundingClientRect().height / 4,
      }),
    }));

    function handleResize() {
      setGutters((current) => ({
        ...current,
        ...(headerRef.current && {
          top: headerRef.current?.getBoundingClientRect().height / 4,
        }),
        ...(uiBottomRef.current && {
          bottom: isPlayerOpen
            ? uiBottomRef.current?.getBoundingClientRect().height / 4
            : 0,
        }),
      }));
    }

    function handlePlayerOpen() {
      setIsPlayerOpen(true);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("player-open", handlePlayerOpen); // TODO: This may come from the Player Context.

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("player-open", handlePlayerOpen);
    };
  }, [isPlayerOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Detect browser UI when route changes.
  useEffect(() => {
    const { childElementCount } = drawerRef.current || {};
    setHasBrowser(!!childElementCount && childElementCount > 1);
  }, [pathname]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Scroll to top when route changes.
  useEffect(() => {
    window.scrollTo(0, 0);

    if (document.startViewTransition) {
      document.startViewTransition();
    }
  }, [pathname]);

  return (
    <div
      className="group/ui grid min-h-svh transition-[--gutter-top,--gutter-bottom,--gutter-left,--gutter-right,--ui-drawer--width]"
      style={styles}
      {...(isMenuOpen && { "data-menu-open": true })}
      {...(isPlayerOpen && { "data-player-open": true })}
    >
      <header
        ref={headerRef}
        className="
        fixed bottom-full translate-y-(--gutter-top) z-(--z-ui) grid 
        before:absolute before:inset-0 before:z-[-1] before:bg-navy-blue/30 before:backdrop-blur-lg before:mask-b-from-25% before:mask-b-to-100%
      "
      >
        <div className="p-4 hidden">
          <div className="bg-foreground text-navy-blue rounded-md max-w-[900px] grid place-content-center mx-auto p-6">
            CTA
          </div>
        </div>
        <div className="flex justify-between w-screen p-3">
          <h1 className="flex items-center gap-2">
            <button
              type="button"
              className="p-1 cursor-pointer"
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </button>
            <Link href="/">
              <Logo animated duration="30s" />
            </Link>
          </h1>
          <span>
            <DonateModalLink
              campaign="731684"
              className="flex items-center gap-x-1 bg-red bg-linear-to-r from-red to-purple hover:to-red border border-red rounded-sm px-2 py-1 font-medium"
            >
              <HeartHandshakeIcon aria-label="Donate" />
              <span className="hidden md:inline" aria-hidden>
                Donate
              </span>
            </DonateModalLink>
          </span>
        </div>
      </header>
      <div
        className={cn(
          "fixed inset-0 flex flex-col transition-transform z-(--z-dialog) bg-linear-to-r from-blue to-green",
          "md:top-(--gutter-top) md:bottom-(--gutter-bottom) md:right-auto md:w-min md:bg-none",
          isMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        inert={!isMenuOpen}
      >
        {/* Header */}
        <div className="col-span-full p-3 md:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1 cursor-pointer"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <MenuIcon />
            </button>
            <Link href="/">
              <Logo animated duration="30s" />
            </Link>
          </div>
        </div>

        {/* Tag Line */}
        <div className="p-4 pt-0 text-base/5">
          <p>Public radio’s longest-running daily global news program.</p>
        </div>

        {/* Menu and Browser */}
        <div
          ref={drawerRef}
          className={cn(
            "grow grid grid-cols-1 gap-x-2",
            "md:w-(--ui-drawer--width)",
            {
              "max-md:*:nth-[n+2]:hidden": hasBrowser,
              "md:grid-cols-[1fr_calc(var(--spacing)*62)]": hasBrowser,
            },
          )}
          onPointerLeave={() => setIsMenuExpanded(false)}
        >
          <div
            className={cn(
              "overflow-y-auto transition-all",
              "grid border-1 border-white/20 p-1 rounded-lg", // TEMP STYLES
            )}
            onPointerEnter={() => setIsMenuExpanded(true)}
          >
            <div
              className={cn(
                "grid place-items-center bg-foreground md:bg-foreground/30 rounded-md text-navy-blue", // TEMP STYLES
              )}
            >
              <span className={cn({ "[writing-mode:vertical-lr]": !!browser })}>
                MENU
              </span>
              <button
                className="grid place-items-center"
                type="button"
                onClick={() => {
                  document.dispatchEvent(
                    new CustomEvent("player-open", {
                      bubbles: true,
                      cancelable: true,
                    }),
                  );
                }}
              >
                <PlayIcon />
              </button>
            </div>
          </div>
          {browser}
        </div>

        {/* Footer */}
        <div className="p-4 text-xs/4">
          <p>©2025 The World from PRX</p>
          <p>
            PRX is a 501(c)(3) organization recognized by the IRS: #263347402.
          </p>
        </div>
      </div>
      <div
        ref={uiBottomRef}
        className={cn(
          "fixed inset-0 top-auto transition-transform",
          isPlayerOpen ? "translate-y-0" : "translate-y-full",
        )}
        inert={!isPlayerOpen}
      >
        <div className="grid place-items-center h-20 bg-foreground/30 text-navy-blue">
          PLAYER
          <button
            type="button"
            onClick={() => {
              setIsPlayerOpen(false);
            }}
            className="absolute top-2 right-2"
          >
            <XIcon />
          </button>
        </div>
      </div>

      <MainUIContext.Provider value={{ isMenuOpen }}>
        {children}
      </MainUIContext.Provider>

      <footer className="self-end flex gap-[24px] flex-wrap p-4 md:ml-(--gutter-left) mb-(--gutter-bottom) items-center justify-center font-serif">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
