import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { CassetteTapeIcon } from "lucide-react";

export default async function SegmentsHero() {
  return (
    <HeroHeader fullWidth>
      <h1 className="flex gap-2 items-center text-3xl font-black">
        <CassetteTapeIcon className="size-[1em]" /> Segments
      </h1>
    </HeroHeader>
  );
}
