import type { CSSProperties } from "react";
import { Globe2Icon } from "lucide-react";
import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { ExplorerClearSearch } from "@/app/(main)/_components/Explorer";

export default async function ContinentsHero() {
  return (
    <HeroHeader
      style={
        {
          "--_menu-width": "var(--gutter-left)",
          "--_gutter-left": "calc(var(--_menu-width) + (var(--spacing) * 10))",
        } as CSSProperties
      }
      className="pl-2 snap-always snap-start md:pl-(--_gutter-left)"
      classes={{ content: "max-w-none mx-0 md:px-4" }}
    >
      <div className="grid gap-y-4 max-w-3xl text-pretty">
        <h1 className="flex gap-4 items-center capitalize text-3xl md:text-4xl font-bold text-balance">
          <Globe2Icon className="size-9" />
          <span>Content By Continent</span>
        </h1>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ExplorerClearSearch />
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>
    </HeroHeader>
  );
}
