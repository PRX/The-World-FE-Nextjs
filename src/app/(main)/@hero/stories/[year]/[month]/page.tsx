import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { DateTime } from "@/components/DateTime";
import { BookOpenIcon } from "lucide-react";

export default async function StoriesByMonthHero({
  params,
}: {
  params: Promise<Record<"year" | "month", string>>;
}) {
  const { year: yearParam, month: monthParam } = await params;

  const year = parseInt(yearParam, 10);
  const month = parseInt(monthParam, 10);
  const hasNanParams = [year, month].reduce(
    (a, v) => a || Number.isNaN(v),
    false,
  );

  if (hasNanParams) {
    return null;
  }

  const date = new Date(year, month - 1, 1, 12);

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
            }}
          />
        </span>
      </ExplorerHeroHeading>
    </ExplorerHero>
  );
}
