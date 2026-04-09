import { CompassIcon } from "lucide-react";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";

export default async function ContributorsHero() {
  return (
    <ExplorerHero>
      <ExplorerHeroHeading>
        <CompassIcon />
        <span>Explore The World</span>
      </ExplorerHeroHeading>
    </ExplorerHero>
  );
}
