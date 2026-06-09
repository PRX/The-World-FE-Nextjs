import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { DateTime } from "@/components/DateTime";
import { BoomBoxIcon } from "lucide-react";

export default async function SegmentsByDateHero({
  params,
}: {
  params: Promise<Record<"year" | "month" | "day", string>>;
}) {
  const { year: yearParam, month: monthParam, day: dayParam } = await params;

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);
  const day = parseInt(dayParam, 10);
  const hasNanParams = [year, month, day].reduce(
    (a, v) => a || Number.isNaN(v),
    false,
  );

  if (hasNanParams) {
    return null;
  }
  const date = new Date(year, month - 1, day, 12);

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
              month: "long",
              day: "numeric",
            }}
          />
        </span>
      </ExplorerHeroHeading>
    </ExplorerHero>
  );
}
