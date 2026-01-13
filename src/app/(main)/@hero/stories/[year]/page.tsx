import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { DateTime } from "@/components/DateTime";
import { BookOpenIcon } from "lucide-react";

export default async function StoriesByYearHero({
  params,
}: {
  params: Promise<Record<"year", string>>;
}) {
  const { year } = await params;

  const date = new Date(`${year}/01`);

  return (
    <HeroHeader fullWidth>
      <h1 className="flex gap-2 items-center text-3xl font-black">
        <BookOpenIcon className="size-[1em]" />
        Stories for{" "}
        <DateTime
          date={date}
          options={{
            year: "numeric",
          }}
        />
      </h1>
    </HeroHeader>
  );
}
