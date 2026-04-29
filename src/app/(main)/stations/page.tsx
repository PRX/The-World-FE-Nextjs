import type { Metadata, ResolvingMetadata } from "next";
import { fetchGqlStations, type StationsQueryOptions } from "@/lib/fetch";
import { unstable_cache } from "next/cache";
import StationFinder from "./_components/StationFinder";
import { OrderEnum, PostObjectsConnectionOrderbyEnum } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "../_components/CtaRegion";
import { convertSeoToMetadata } from "@/lib/parse/seo";

export const getCachedStations = unstable_cache(
  async (query?: StationsQueryOptions) => fetchGqlStations(query),
  ["stations"],
  {
    tags: ["stations"],
    revalidate: 60,
  },
);

export async function generateMetadata(
  _props: Record<string, string>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const metadata = await parent.then((r) => r as Metadata);
  const seoTitle = "Broadcast Station Finder";
  const description =
    "Find the broadcast station near you that is carrying The World.";
  const link = "https://theworld.org/stations";
  const md = {
    canonical: link,
    title: seoTitle,
    metaDesc: description,
    opengraphTitle: seoTitle,
    opengraphDescription: description,
    opengraphUrl: link,
    twitterTitle: seoTitle,
    twitterDescription: description,
  };

  return convertSeoToMetadata(md, metadata) || {};
}

export default async function StationsPage() {
  const data = await getCachedStations({
    first: Infinity,
    where: {
      orderby: [
        {
          field: PostObjectsConnectionOrderbyEnum.Title,
          order: OrderEnum.Asc,
        },
      ],
    },
  });
  const { nodes = [] } = data || {};

  const shownContentEndMessage = await getCtaRegionMessages(
    "landing-inline-bottom",
  ).then((messages) => getShownMessage(messages));

  return (
    <main className="mt-10 px-8 md:ml-(--gutter-left) md:mr-(--gutter-right)">
      <div className="grid gap-8 max-w-7xl mx-auto">
        <StationFinder data={nodes} />
      </div>

      {shownContentEndMessage && (
        <div className="mt-20">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </main>
  );
}
