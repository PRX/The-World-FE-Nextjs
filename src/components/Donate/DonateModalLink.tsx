"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DonateModalLink({
  campaign,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  campaign: string;
}) {
  const [modal, setModal] = useState<{ open: (c: string) => void }>();
  const handleClick = useCallback(() => {
    modal?.open(campaign);
  }, [campaign, modal]);

  useEffect(() => {
    const { eg } = window as Window & {
      eg?: { modal: { open: (c: string) => void } };
    };

    setModal(eg?.modal);
  }, []);

  return modal ? (
    <Button
      type="button"
      {...props}
      className={cn("cursor-pointer", className)}
      onClick={handleClick}
    >
      {children}
    </Button>
  ) : (
    <Button asChild {...props}>
      <a
        href={`?campaign=${campaign}`}
        target={`donate-to-the-world:${campaign}`}
      >
        {children}
      </a>
    </Button>
  );
}
