import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { DateTime } from "@/components/DateTime";
import { BookOpenIcon } from "lucide-react";

export default async function StoriesByMonthHero({
  params,
}: {
  params: Promise<Record<"year" | "month", string>>;
}) {
  const { year, month } = await params;

  const date = new Date(`${year}/${month}`);

  return (
    <HeroHeader fullWidth>
      <h1 className="flex gap-2 items-center text-3xl font-black">
        <BookOpenIcon className="size-[1em]" />
        Stories for{" "}
        <DateTime
          date={date}
          options={{
            year: "numeric",
            month: "long",
          }}
        />
      </h1>
    </HeroHeader>
  );
}
