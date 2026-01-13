import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import PlausibleProvider from "next-plausible";
import MainUI from "./_components/MainUI";
import "./_css/main.css";
import "@/css/globals.css";
import LogoDefs from "./_components/Logo/LogoDefs";
import LogoGlobe from "./_components/Logo/LogoGlobe";
import { fetchGqlApp } from "@/lib/fetch";

export const getCachedAppData = unstable_cache(
  async () => fetchGqlApp(),
  ["app"],
  {
    tags: ["app"],
    revalidate: 60,
  },
);

export const metadata: Metadata = {
  title: "The World from PRX",
  description:
    "The World is a public radio program that crosses borders and time zones to bring home the stories that matter. From PRX.",
};

export default async function MainLayout({
  children,
  browser,
  hero,
  siteBanner,
}: Readonly<{
  children: React.ReactNode;
  browser: React.ReactNode;
  hero: React.ReactNode;
  siteBanner: React.ReactNode;
}>) {
  const appDomain = process.env.APP_DOMAIN || "";
  const { menus, settings } = (await getCachedAppData()) || { menus: {} };
  const mainUiProps = {
    browser,
    hero,
    siteBanner,
    menus,
    settings,
  };

  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://giving.classy.org/embedded/api/sdk/js/72482"
        />
      </head>
      <body className="antialiased overflow-clip overflow-y-auto max-md:has-data-menu-open:overflow-y-clip">
        <div className="fixed inset-0 z-[-1] bg-linear-to-r/oklch from-blue to-green overflow-clip">
          <LogoGlobe
            animated
            className="absolute left-0 bottom-0 aspect-square w-[calc(max(110vw,110vh))] max-h-[160vh] translate-x-[-30%] translate-y-[50%] opacity-10"
          />
        </div>
        <PlausibleProvider
          enabled={!!appDomain}
          domain={appDomain}
          selfHosted
          trackOutboundLinks
        >
          <MainUI {...mainUiProps}>{children}</MainUI>
        </PlausibleProvider>
        <LogoDefs />
      </body>
    </html>
  );
}
