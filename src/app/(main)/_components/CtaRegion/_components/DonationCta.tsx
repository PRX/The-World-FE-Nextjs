"use client";

import DonateModalLink from "@/components/Donate/DonateModalLink";
import { HtmlContent } from "@/components/HtmlContent";
import { Button } from "@/components/ui/button";
import type { ICtaMessage } from "@/interfaces";
import Link from "next/link";

export default function DonationCta({
  cta,
  onClose,
}: {
  cta: ICtaMessage;
  onClose?(): void;
}) {
  const { heading, message, action, dismiss } = cta;
  const hasActions = !!(action || dismiss);
  const canDismiss = !!(dismiss && onClose);
  const { cidParam, cidSegment } =
    /^\?campaign=(?<cidParam>[^&]+)|give\/(?<cidSegment>[^/]+)/.exec(
      action?.url || "",
    )?.groups || {};
  const handleActionClick = () => {
    onClose?.();
  };
  const handleDismissClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    onClose?.();
  };

  return (
    <aside className="grid gap-y-4">
      {heading && <h2 className="font-black text-xl/tight">{heading}</h2>}
      {message && (
        <HtmlContent
          html={message}
          className="text-lg/tight [&>*+*]:mt-[0.75em]"
        />
      )}
      {hasActions && (
        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
          {action &&
            ((cidParam && (
              <DonateModalLink campaign={cidParam} variant="action" size="lg">
                {action.name}
              </DonateModalLink>
            )) ||
              (cidSegment && (
                <Button
                  variant="action"
                  size="lg"
                  onClick={handleActionClick}
                  asChild
                >
                  <Link href={action.url} target="_tw_cta">
                    {action.name}
                  </Link>
                </Button>
              )))}
          {canDismiss && (
            <Button
              className="cursor-pointer"
              variant={!action ? "action" : "ghost"}
              size="sm"
              onClick={handleDismissClick}
            >
              {dismiss.name}
            </Button>
          )}
        </div>
      )}
    </aside>
  );
}
