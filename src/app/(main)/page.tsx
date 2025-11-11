import Image from "next/image";
import Link from "next/link";
import cn from "@/lib/util/css/cn";
import MiniMenu from "./_components/MiniMenu";

export default function Home() {
  return (
    <div
      className={cn(
        "pt-(--gutter-top) pr-(--gutter-right)",
        "md:grid md:grid-cols-[minmax(var(--gutter-left),min-content)_1fr]",
      )}
    >
      <div className="hidden md:block">
        <div
          className={cn(
            "group-data-menu-open/ui:-translate-x-full transition-transform",
            "sticky top-(--gutter-top) bottom-(--gutter-bottom) left-0",
          )}
        >
          <MiniMenu />
        </div>
      </div>
      <main className="col-start-2 grid p-8 min-h-[200vh] transition-margin">
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
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
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
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
    </div>
  );
}
