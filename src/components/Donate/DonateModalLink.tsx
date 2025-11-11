"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useCallback, useEffect, useState } from "react";

export default function DonateModalLink({
  campaign,
  className,
  children,
  ...props
}: {
  campaign: string;
  children?: ReactNode;
  className?: string;
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
    <button
      type="button"
      className={cn("cursor-pointer", className)}
      onClick={handleClick}
    >
      {children}
    </button>
  ) : (
    <a
      className={cn(className)}
      href={`?campaign=${campaign}`}
      target={`donate-to-the-world:${campaign}`}
      {...props}
    >
      {children}
    </a>
  );
}
