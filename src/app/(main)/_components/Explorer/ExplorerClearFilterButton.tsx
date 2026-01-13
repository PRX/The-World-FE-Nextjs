"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ExplorerFilterBadgeProps = React.ComponentProps<typeof Button> & {
  param: string;
};

export default function ExplorerClearFilterButton({
  param,
  className,
  ...buttonProps
}: ExplorerFilterBadgeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());

    currentParams.delete(param);

    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return (
    <Button
      {...buttonProps}
      className={cn("cursor-pointer", className)}
      onClick={handleClick}
    />
  );
}
