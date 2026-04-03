import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { DateTime } from "@/components/DateTime";
import { BookOpenIcon } from "lucide-react";

export default async function StoriesByDateHero({
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
        <BookOpenIcon />
        <span>
          Stories for{" "}
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
