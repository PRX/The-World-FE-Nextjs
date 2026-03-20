"use client";

import type { ICtaMessage } from "@/interfaces";
import { useContext, useState } from "react";
import MainUIContext from "@/app/(main)/_contexts/MainUIContext";
import { Button } from "@/components/ui/button";
import { setCtaCookie } from "@/lib/cta";
import { cn } from "@/lib/util/css";
import DonationCta from "./_components/DonationCta";
import InfoCta from "./_components/InfoCta";
import NewsletterCta from "./_components/NewsletterCta";
import { XIcon } from "lucide-react";
import { cva } from "class-variance-authority";

export const ctaTypeMap = new Map();
ctaTypeMap.set("donation", DonationCta);
ctaTypeMap.set("info", InfoCta);
ctaTypeMap.set("newsletter", NewsletterCta);

export const ctaRegionVariants = cva(
  "overflow-clip p-4 pl-6 pr-6 rounded-md bg-linear-to-r [--button-background:var(--color-red)] [--button-background-end:var(--color-purple)] before:absolute before:inset-0 before:right-auto before:w-2 before:bg-linear-to-b before:from-[var(--button-background,var(--color-red))] before:to-[var(--button-background-end,var(--color-purple))]",
  {
    variants: {
      type: {
        donation: "from-light-blue to-purple",
        info: "from-green to-light-blue [--button-background:var(--color-blue)] [--button-background-end:var(--color-dark-purple)]",
        newsletter:
          "from-light-blue to-navy-blue [--button-background-end:var(--color-burnt-orange)]",
      },
    },
    defaultVariants: {
      type: "info",
    },
  },
);

export default function CtaRegion({
  className,
  cta,
  dismissible = false,
}: {
  className?: string;
  cta: ICtaMessage;
  dismissible?: boolean;
}) {
  const { updateGutters } = useContext(MainUIContext);
  const { id, type, hash } = cta;
  const CtaComponent = ctaTypeMap.get(type);
  const CtaComponentProps = { cta };
  const [dismissed, setDismissed] = useState(false);
  const isDismissed = dismissible && dismissed;
  const handleDismiss = () => {
    setCtaCookie(id, hash);
    setDismissed(true);
    updateGutters();
  };

  if (!CtaComponent || isDismissed) return null;

  return (
    <div
      className={cn(
        "@container/cta-region max-w-250 mx-auto relative",
        ctaRegionVariants({ type }),
        className,
      )}
    >
      {dismissible && (
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "absolute top-0 right-0 size-6 rounded-tl-none rounded-br-none hover:bg-(--button-background)",
            "max-md:size-10",
          )}
          onClick={handleDismiss}
        >
          <XIcon className="size-5" />
        </Button>
      )}
      <CtaComponent
        {...CtaComponentProps}
        onClose={dismissible && handleDismiss}
      />
    </div>
  );
}
