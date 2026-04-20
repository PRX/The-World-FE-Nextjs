import type { Metadata } from "next";
import { fetchGqlStations, type StationsQueryOptions } from "@/lib/fetch";
import { unstable_cache } from "next/cache";
import StationFinder from "./_components/StationFinder";
import { OrderEnum, PostObjectsConnectionOrderbyEnum } from "@/interfaces";
import { getCtaRegionMessages, getShownMessage } from "@/lib/cta";
import CtaRegion from "../_components/CtaRegion";
import { Suspense } from "react";

export const getCachedStations = unstable_cache(
  async (query?: StationsQueryOptions) => fetchGqlStations(query),
  ["stations"],
  {
    tags: ["stations"],
    revalidate: 60,
  },
);

export const metadata: Metadata = {
  title: "Broadcast Station Finder - The World from PRX",
  description:
    "Find the broadcast station near you that is carrying The World.",
};

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
        <Suspense fallback={<StationFinder data={nodes} />}>
          <StationFinder data={nodes} />
        </Suspense>
      </div>

      {shownContentEndMessage && (
        <div className="mt-20">
          <CtaRegion cta={shownContentEndMessage} />
        </div>
      )}
    </main>
  );
}
