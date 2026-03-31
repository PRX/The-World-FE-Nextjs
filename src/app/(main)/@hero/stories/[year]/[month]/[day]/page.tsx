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

  const date = new Date(`${year}/${month}/${day}`);

  return (
    <ExplorerHero>
      <ExplorerHeroHeading>
        <BookOpenIcon />
        Stories for{" "}
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
