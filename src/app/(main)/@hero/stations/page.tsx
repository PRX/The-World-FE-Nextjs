import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/util/css";
import { RadioTowerIcon } from "lucide-react";

export default function PodcastsHero() {
  return (
    <HeroHeader classes={{ content: "max-w-7xl w-full px-8" }}>
      <div className="grid gap-y-4 text-pretty">
        <h1
          className={cn(
            "grid has-[>svg]:grid-cols-[1em_1fr] gap-2 items-start text-3xl md:text-5xl font-black text-balance *:first-letter:capitalize",
            "[&_svg:not([class*='size-'])]:size-[1em]",
          )}
        >
          <RadioTowerIcon />
          <span>Broadcast Station Finder</span>
        </h1>
        <Separator />
      </div>
    </HeroHeader>
  );
}
