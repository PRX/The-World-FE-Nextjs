import { BookOpenIcon } from "lucide-react";
import {
  ExplorerHero,
  ExplorerHeroHeading,
} from "@/app/(main)/_components/Explorer";

export default async function StoriesHero() {
  return (
    <ExplorerHero>
      <ExplorerHeroHeading>
        <BookOpenIcon />
        <span>Stories</span>
      </ExplorerHeroHeading>
    </ExplorerHero>
  );
}
