import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { BoomBoxIcon } from "lucide-react";

export default async function EpisodesByMonthHero({
  params,
}: {
  params: Promise<Record<"year" | "month", string>>;
}) {
  const { year, month } = await params;

  const date = new Date(`${year}/${month}`);

  return (
    <HeroHeader fullWidth>
      <h1 className="flex gap-2 items-center text-3xl font-black">
        <BoomBoxIcon className="size-[1em]" />
        Episodes for{" "}
        {date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
        })}
      </h1>
    </HeroHeader>
  );
}
