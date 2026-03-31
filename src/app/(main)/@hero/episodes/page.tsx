import { BoomBoxIcon } from "lucide-react";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";

export default async function EpisodesHero() {
  return (
    <ExplorerHero>
      <ExplorerHeroHeading>
        <BoomBoxIcon /> Episodes
      </ExplorerHeroHeading>
    </ExplorerHero>
  );
}
