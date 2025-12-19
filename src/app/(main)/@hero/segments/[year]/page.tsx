import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { CassetteTapeIcon } from "lucide-react";

export default async function SegmentsByYearHero({
  params,
}: {
  params: Promise<Record<"year", string>>;
}) {
  const { year } = await params;

  const date = new Date(`${year}/01`);

  return (
    <HeroHeader fullWidth>
      <h1 className="flex gap-2 items-center text-3xl font-black">
        <CassetteTapeIcon className="size-[1em]" />
        Segments for{" "}
        {date.toLocaleDateString(undefined, {
          year: "numeric",
        })}
      </h1>
    </HeroHeader>
  );
}
