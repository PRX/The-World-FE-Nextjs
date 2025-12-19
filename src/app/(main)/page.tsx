import Image from "next/image";
import Link from "next/link";
import cn from "@/lib/util/css/cn";
import MiniMenu from "./_components/MiniMenu";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div
      className={cn(
        "pl-[max(var(--gutter-left),var(--spacing)*28)] pr-(--gutter-right)",
      )}
    >
      <div className="hidden md:block">
        <div
          className={cn(
            "group-data-menu-open/ui:-translate-x-full transition-transform",
            "fixed top-(--gutter-top) bottom-(--gutter-bottom) left-0 w-28",
          )}
        >
          <MiniMenu />
        </div>
      </div>
      <main className="col-start-2 grid content-start gap-y-3 p-8 min-h-[200vh] transition-margin">
        <Image
          className="dark:invert w-45"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={36.55}
          priority
        />

        <Link href="/episodes/2025/09/24/russian-military-continues-grinding-advance-in-donetsk">
          Episode (No Image)
        </Link>
        <Link href="episodes/2025/09/17/chinese-evs-flood-the-market-across-major-southeast-asian-cities">
          Episode
        </Link>

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button asChild>
            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </Button>
        </div>
      </main>
    </div>
  );
}
