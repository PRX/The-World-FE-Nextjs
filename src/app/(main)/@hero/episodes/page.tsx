import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { BoomBoxIcon } from "lucide-react";

export default async function EpisodesHero() {
  return (
    <HeroHeader fullWidth>
      <h1 className="flex gap-2 items-center text-3xl font-black">
        <BoomBoxIcon className="size-[1em]" /> Episodes
      </h1>
    </HeroHeader>
  );
}
