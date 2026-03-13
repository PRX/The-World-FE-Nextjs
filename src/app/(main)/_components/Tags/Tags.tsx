/**
 * @file Tags.tsx
 * Component for Tags elements.
 */

import { Button } from "@/components/ui/button";
import type { TermNode } from "@/interfaces";
import { generateContentLinkHref } from "@/lib/routing/content";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type TagsProps = React.ComponentProps<"div"> & {
  data: TermNode[];
  label?: string;
};

export const Tags = ({ data, label, className, ...props }: TagsProps) => {
  return (
    <aside
      className={cn("flex flex-wrap items-center gap-2 my-2", className)}
      {...props}
    >
      {label && (
        <h2 className="m-0 text-lg uppercase tracking-wide w-full">{label}</h2>
      )}
      {data
        .filter((v) => !!v)
        .map((item) => {
          const linkHref = generateContentLinkHref(item.link);
          return (
            linkHref && (
              <Button
                className="bg-current/10 capitalize"
                variant="ghost"
                size="sm"
                key={item.id}
                asChild
              >
                <Link href={linkHref}>{item.name}</Link>
              </Button>
            )
          );
        })}
    </aside>
  );
};
