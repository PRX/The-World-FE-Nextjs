"use client";

import { HtmlContent } from "@/components/HtmlContent";
import { Button } from "@/components/ui/button";
import type { ICtaMessage } from "@/interfaces";
import Link from "next/link";

export default function InfoCta({
  cta,
  onClose,
}: {
  cta: ICtaMessage;
  onClose?(): void;
}) {
  const { heading, message, action, dismiss } = cta;
  const hasActions = !!(action || dismiss);
  const canDismiss = !!(dismiss && onClose);
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
        <div className="flex items-center gap-x-4">
          {action && (
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
          )}
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
