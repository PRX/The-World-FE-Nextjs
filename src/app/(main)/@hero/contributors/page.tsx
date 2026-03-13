import type { CSSProperties } from "react";
import { UsersIcon } from "lucide-react";
import HeroHeader from "@/app/(main)/_components/HeroHeader";

export default async function ContributorsHero() {
  return (
    <HeroHeader
      style={
        {
          "--_menu-width": "max(var(--gutter-left), var(--spacing) * 20)",
          "--_gutter-left": "calc(var(--_menu-width) + (var(--spacing) * 10))",
        } as CSSProperties
      }
      className="pl-(--_gutter-left)"
      classes={{ content: "max-w-none mx-0 md:px-4" }}
    >
      <div className="grid gap-y-4 max-w-3xl text-pretty">
        <h1 className="flex gap-4 items-center capitalize text-3xl md:text-4xl font-bold text-balance">
          <UsersIcon className="size-9" /> Content By Contributor
        </h1>
      </div>
    </HeroHeader>
  );
}
