import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { BookOpenIcon } from "lucide-react";

export default async function StoriesByDateHero({
  params,
}: {
  params: Promise<Record<"year" | "month" | "day", string>>;
}) {
  const { year, month, day } = await params;

  const date = new Date(`${year}/${month}/${day}`);

  return (
    <HeroHeader fullWidth>
      <h1 className="flex gap-2 items-center text-3xl font-black">
        <BookOpenIcon className="size-[1em]" />
        Stories for{" "}
        {date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </h1>
    </HeroHeader>
  );
}
