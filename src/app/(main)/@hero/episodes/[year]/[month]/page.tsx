import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { DateTime } from "@/components/DateTime";
import { BoomBoxIcon } from "lucide-react";

export default async function EpisodesByMonthHero({
  params,
}: {
  params: Promise<Record<"year" | "month", string>>;
}) {
  const { year, month } = await params;

  const date = new Date(`${year}/${month}`);

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
          }}
        />
      </ExplorerHeroHeading>
    </ExplorerHero>
  );
}
