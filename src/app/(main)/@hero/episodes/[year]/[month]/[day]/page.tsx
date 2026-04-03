import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { DateTime } from "@/components/DateTime";
import { BoomBoxIcon } from "lucide-react";

export default async function EpisodesByDateHero({
  params,
}: {
  params: Promise<Record<"year" | "month" | "day", string>>;
}) {
  const { year, month, day } = await params;

  const date = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    12,
  );

  return (
    <ExplorerHero>
      <ExplorerHeroHeading>
        <BoomBoxIcon />
        Episodes for{" "}
        <DateTime
          date={date}
          options={{
            year: "numeric",
            month: "long",
            day: "numeric",
          }}
        />
      </ExplorerHeroHeading>
    </ExplorerHero>
  );
}
