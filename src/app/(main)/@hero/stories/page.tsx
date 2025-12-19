import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { BookOpenIcon } from "lucide-react";

export default async function StoriesHero() {
  return (
    <HeroHeader fullWidth>
      <h1 className="flex gap-2 items-center text-3xl font-black">
        <BookOpenIcon className="size-[1em]" /> Stories
      </h1>
    </HeroHeader>
  );
}
