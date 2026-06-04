import type { Metadata, ResolvingMetadata } from "next";
import { unstable_cache } from "next/cache";
import PlausibleProvider from "next-plausible";
import MainUI from "./_components/MainUI";
import "./_css/main.css";
import "@/css/globals.css";
import LogoDefs from "./_components/Logo/LogoDefs";
import LogoGlobe from "./_components/Logo/LogoGlobe";
import { fetchGqlApp } from "@/lib/fetch";
import { Player } from "@/components/Player";
import { SITE_METADATA } from "./_metadata";
import { merge } from "lodash";
import { cn } from "@/lib/util/css";

export const getCachedAppData = unstable_cache(
  async () => fetchGqlApp(),
  ["app"],
  {
    tags: ["app"],
    revalidate: 60,
  },
);

type Props = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const metadata = await parent;
  const md = structuredClone(metadata);

  merge(md, SITE_METADATA);

  return md as Metadata;
}

export default async function MainLayout({
  children,
  browser,
  hero,
  search,
  siteBanner,
}: Readonly<{
  children: React.ReactNode;
  browser: React.ReactNode;
  hero: React.ReactNode;
  search: React.ReactNode;
  siteBanner: React.ReactNode;
}>) {
  const { menus, settings } = (await getCachedAppData()) || { menus: {} };
  const mainUiProps = {
    browser,
    hero,
    search,
    siteBanner,
    menus,
    settings,
  };

  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        "max-md:has-data-menu-open:overflow-y-clip",
        "pointer-coarse:snap-proximity pointer-coarse:snap-y pointer-coarse:scroll-pt-(--gutter-top) pointer-coarse:scroll-pb-(--gutter-bottom)",
      )}
    >
      <head>
        <script
          async
          src="https://giving.classy.org/embedded/api/sdk/js/72482"
        />
      </head>
      <body>
        <div className="fixed inset-0 z-[-1] bg-linear-to-r/oklch from-blue to-green overflow-clip">
          <LogoGlobe
            animated
            className="absolute left-0 bottom-0 aspect-square w-[calc(max(110vw,110vh))] max-h-[160vh] translate-x-[-30%] translate-y-[50%] opacity-10"
          />
        </div>
        <PlausibleProvider>
          <Player>
            <MainUI {...mainUiProps}>{children}</MainUI>
          </Player>
        </PlausibleProvider>
        <LogoDefs />
      </body>
    </html>
  );
}
