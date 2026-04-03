import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { DateTime } from "@/components/DateTime";
import { BookOpenIcon } from "lucide-react";

export default async function StoriesByYearHero({
  params,
}: {
  params: Promise<Record<"year", string>>;
}) {
  const { year } = await params;

  const date = new Date(parseInt(year, 10), 1, 1, 12);

  return (
    <ExplorerHero>
      <ExplorerHeroHeading>
        <BookOpenIcon />
        Stories for{" "}
        <DateTime
          date={date}
          options={{
            year: "numeric",
          }}
        />
      </ExplorerHeroHeading>
    </ExplorerHero>
  );
}
