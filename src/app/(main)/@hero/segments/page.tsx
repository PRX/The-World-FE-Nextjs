import { CassetteTapeIcon } from "lucide-react";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";

export default async function SegmentsHero() {
  return (
    <ExplorerHero>
      <ExplorerHeroHeading>
        <CassetteTapeIcon />
        <span>Segments</span>
      </ExplorerHeroHeading>
    </ExplorerHero>
  );
}
