import Image from "next/image";
import Link from "next/link";
import cn from "@/lib/util/css/cn";
import MiniMenu from "./_components/MiniMenu";
import { Button } from "@/components/ui/button";
import { unstable_cache } from "next/cache";
import { fetchGqlHomepage } from "@/lib/fetch";

export const getCachedHomepage = unstable_cache(
  async () => fetchGqlHomepage(),
  ["homepage"],
  {
    tags: ["homepage", "content"],
    revalidate: 60,
  },
);

export default async function Home() {
  const data = await getCachedHomepage();

  return (
    <div
      className={cn(
        "pl-[max(var(--gutter-left),var(--spacing)*28)] pr-(--gutter-right)",
      )}
    >
      <div className="hidden md:block">
        <div
          className={cn(
            "group-data-menu-open/ui:-translate-x-full delay-(--default-transition-duration) transition-transform",
            "fixed top-(--gutter-top) bottom-(--gutter-bottom) left-0 w-28",
          )}
        >
          <MiniMenu />
        </div>
      </div>
      <main className="col-start-2 grid content-start gap-y-3 p-8 min-h-[200vh] transition-margin"></main>
    </div>
  );
}
