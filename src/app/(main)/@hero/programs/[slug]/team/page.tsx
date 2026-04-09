import type { Program } from "@/interfaces";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";
import { getCachedProgram } from "@/app/(main)/programs/[slug]/page";
import { UsersIcon } from "lucide-react";

export default async function TaxonomyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: Program | undefined;

  if (slug) {
    data = await getCachedProgram(slug);
  }

  if (!data) {
    return null;
  }

  const { name } = data;

  return (
    <ExplorerHero>
      <div className="grid gap-y-4 max-w-3xl text-pretty">
        <ExplorerHeroHeading>
          <UsersIcon />
          <span>{name} Team</span>
        </ExplorerHeroHeading>
      </div>
    </ExplorerHero>
  );
}
