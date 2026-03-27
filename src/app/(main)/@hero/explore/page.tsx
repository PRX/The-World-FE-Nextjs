import { CompassIcon } from "lucide-react";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { Separator } from "@/components/ui/separator";

export default async function ContributorsHero() {
  return (
    <HeroHeader
      className="px-8 md:ml-(--gutter-left)"
      classes={{ content: "max-w-7xl px-0 md:px-0" }}
    >
      <div className="grid gap-y-4 text-pretty">
        <h1 className="flex gap-4 items-center capitalize text-3xl md:text-4xl font-bold text-balance">
          <CompassIcon className="size-9" /> Explore The World
        </h1>
      </div>
      <Separator />
    </HeroHeader>
  );
}
