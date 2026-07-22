import { getCachedHomepage } from "@/app/(main)/page";
import HeroEpisodesCarousel from "../_components/HeroEpisodesCarousel";
import MiniMenu from "../_components/MiniMenu";
import { cn } from "@/lib/util/css";
import type { CSSProperties } from "react";

export default async function HomeHero() {
  const data = await getCachedHomepage();

  if (!data) return null;

  const { episodes } = data;

  return (
    episodes && (
      <>
        <div className="hidden md:block">
          <div
            className={cn(
              "group-data-menu-open/ui:-translate-x-full delay-(--default-transition-duration) transition-transform",
              "fixed z-[calc(var(--z-ui-player-video)-1)] top-(--gutter-top) left-0 w-28",
            )}
          >
            <MiniMenu />
          </div>
        </div>
        <HeroEpisodesCarousel
          style={
            {
              "--_menu-width": "max(var(--gutter-left), var(--spacing)*28)",
              "--_gutter-left":
                "calc(var(--_menu-width) + (var(--spacing) * 4))",
            } as CSSProperties
          }
          episodes={episodes}
        />
      </>
    )
  );
}
