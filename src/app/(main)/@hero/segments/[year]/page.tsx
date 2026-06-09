import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { DateTime } from "@/components/DateTime";
import { BoomBoxIcon } from "lucide-react";

export default async function SegmentsByYearHero({
  params,
}: {
  params: Promise<Record<"year", string>>;
}) {
  const { year: yearParam } = await params;

  const year = parseInt(yearParam, 10);
  const hasNanParams = Number.isNaN(year);

  if (hasNanParams) {
    return null;
  }

  const date = new Date(year, 1, 1, 12);

  return (
    <ExplorerHero>
      <ExplorerHeroHeading>
        <BoomBoxIcon />
        <span>
          Segments for{" "}
          <DateTime
            date={date}
            options={{
              year: "numeric",
            }}
          />
        </span>
      </ExplorerHeroHeading>
    </ExplorerHero>
  );
}
