"use client";

import { useCallback, type MouseEventHandler } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util/css";
import { SearchIcon, XIcon } from "lucide-react";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";

export type ExplorerClearSearchProps = React.ComponentProps<typeof ButtonGroup>;

export function ExplorerClearSearch({
  className,
  ...props
}: ExplorerClearSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();

      const newSearchParams = new URLSearchParams(searchParams.toString());

      newSearchParams.delete("search");

      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router.push, searchParams.toString],
  );

  return (
    !!search && (
      <ButtonGroup
        className={cn("", className)}
        data-slot="explorer-filter-control-clear-search"
        {...props}
      >
        <ButtonGroupText className="px-2">
          <SearchIcon />
          <span className="">{search}</span>
        </ButtonGroupText>
        <Button
          className="cursor-pointer"
          variant="frosted"
          size="icon"
          title={`Remove search for "${search}"`}
          onClick={handleClick}
        >
          <XIcon className="" />
        </Button>
      </ButtonGroup>
    )
  );
}

export default ExplorerClearSearch;
