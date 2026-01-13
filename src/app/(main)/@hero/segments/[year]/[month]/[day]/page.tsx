import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { DateTime } from "@/components/DateTime";
import { CassetteTapeIcon } from "lucide-react";

export default async function SegmentsByDateHero({
  params,
}: {
  params: Promise<Record<"year" | "month" | "day", string>>;
}) {
  const { year, month, day } = await params;

  const date = new Date(`${year}/${month}/${day}`);

  return (
    <HeroHeader fullWidth>
      <h1 className="flex gap-2 items-center text-3xl font-black">
        <CassetteTapeIcon className="size-[1em]" />
        Segments for{" "}
        <DateTime
          date={date}
          options={{
            year: "numeric",
            month: "long",
            day: "numeric",
          }}
        />
      </h1>
    </HeroHeader>
  );
}
