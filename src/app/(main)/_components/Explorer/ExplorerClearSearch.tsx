"use client";

import type { MouseEventHandler } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util/css";
import { SearchIcon, XIcon } from "lucide-react";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";

export type ExplorerClearSearchProps = React.ComponentProps<
  typeof ButtonGroup
> & {
  siteSearchParams?: Record<"search" | "sf", string>;
};

export function ExplorerClearSearch({
  className,
  siteSearchParams,
  ...props
}: ExplorerClearSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { search } = siteSearchParams || {};

  console.log("CLEAR SEARCH", siteSearchParams, search);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    const newSearchParams = new URLSearchParams(siteSearchParams);

    newSearchParams.delete("search");

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

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
