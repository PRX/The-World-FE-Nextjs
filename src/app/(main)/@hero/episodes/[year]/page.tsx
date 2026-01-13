import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { DateTime } from "@/components/DateTime";
import { BoomBoxIcon } from "lucide-react";

export default async function EpisodesByYearHero({
  params,
}: {
  params: Promise<Record<"year", string>>;
}) {
  const { year } = await params;

  const date = new Date(`${year}/01`);

  return (
    <HeroHeader fullWidth>
      <h1 className="flex gap-2 items-center text-3xl font-black">
        <BoomBoxIcon className="size-[1em]" />
        Episodes for{" "}
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
