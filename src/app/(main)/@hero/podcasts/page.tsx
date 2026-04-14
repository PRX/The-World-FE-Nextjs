import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/util/css";
import { PodcastIcon } from "lucide-react";

export default function PodcastsHero() {
  return (
    <HeroHeader classes={{ content: "max-w-5xl w-full px-8" }}>
      <div className="grid gap-y-4 text-pretty">
        <h1
          className={cn(
            "grid has-[>svg]:grid-cols-[1em_1fr] gap-2 items-start text-3xl md:text-5xl font-black text-balance *:first-letter:capitalize",
            "[&_svg:not([class*='size-'])]:size-[1em]",
          )}
        >
          <PodcastIcon />
          <span>Subscribe to our Podcasts</span>
        </h1>
        <p>
          There are many ways to listen to The World, from podcasts, to
          smartspeakers, apps, and on our local public media broadcast. Find us
          every weekday wherever you choose to listen.
        </p>
        <Separator />
      </div>
    </HeroHeader>
  );
}
