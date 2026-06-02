import type { Category } from "@/interfaces";
import { getCachedCategory } from "@/app/(main)/categories/[...slugs]/page";
import { BookmarkIcon, ChevronRightIcon } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { generateContentLinkHref } from "@/lib/routing";
import Link from "next/link";
import { cn } from "@/lib/util/css";
import { NavigationMenuLinkSeparator } from "@/components/ui/navigation-menu";

export default async function CategoryHero({
  params,
}: {
  params: Promise<{ slugs: string | string[] }>;
}) {
  const { slugs } = await params;
  const slug = slugs && (typeof slugs === "string" ? slugs : slugs.pop());
  let data: Category | undefined;

  if (slug) {
    data = await getCachedCategory(slug);
  }

  if (!data) {
    return null;
  }

  const { children } = data;
  const { nodes } = children || {};

  if (!nodes?.length) {
    return null;
  }

  return (
    <aside className="flex flex-col pt-4 ps-2 overflow-hidden">
      <h2 className="text-balance font-light">Subcategories</h2>

      <NavigationMenuLinkSeparator className="mt-2" />

      <div className="flex flex-col gap-2 py-4 overflow-auto no-scrollbar">
        {nodes.map((n) => {
          const { id, name, link, count } = n;
          const linkHref = generateContentLinkHref(link);

          return (
            linkHref && (
              <Item
                asChild
                key={id}
                variant="muted"
                className={cn(
                  "backdrop-blur-md backdrop-brightness-125 bg-linear-to-r from-cyan/0 to-cyan/0",
                  "hover:from-cyan/30 hover:to-green/20",
                )}
              >
                <Link href={linkHref}>
                  <ItemMedia variant="icon">
                    <BookmarkIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-md/tight">{name}</ItemTitle>
                    <ItemDescription>{count} Posts</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </Link>
              </Item>
            )
          );
        })}
      </div>
    </aside>
  );
}
