"use client";

/**
 * @file EmbedModalContent.tsx
 * Component to display info about the current track.
 */

import type React from "react";
import { useContext, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PlayerContext } from "@/components/Player";
import { ClipboardCheckIcon, ClipboardXIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/util/css";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export type EmbedModalContentProps = React.ComponentProps<"div">;

export function EmbedModalContent({
  className,
  ...other
}: EmbedModalContentProps) {
  const { state } = useContext(PlayerContext);
  const { tracks = [], currentTrackIndex = 0 } = state;
  const currentTrack = tracks[currentTrackIndex];
  const { title, linkResource } = currentTrack || {};
  const { id: embedUrlId } = linkResource || {};
  const embedCode = `<iframe title="TheWorld.org Embedded Audio Player - ${title}" src="https://theworld.org/embed/audio/${embedUrlId}" frameborder="0" height="50" width="100%" allowtransparency="true" style="background-color: transparent; color-scheme: auto; margin-block: 1rem"></iframe>`;
  const [{ copied, failed }, setState] = useState({
    copied: false,
    failed: false,
  });
  const EmbedCodeCopyIcon =
    (copied && ClipboardCheckIcon) || (failed && ClipboardXIcon) || CopyIcon;
  const EmbedCodeCopyLabel =
    (copied && "Copied") || (failed && "Could not copy") || "Copy";
  const EmbedCodeCopyTooltip =
    (copied && "Copied to clipboard!") ||
    (failed && "Could not copy to clipboard.") ||
    "Copy code to clipboard.";

  const handleCopy = (_text: string, result: boolean) =>
    setState({
      copied: result,
      failed: !result,
    });

  return (
    <div
      {...other}
      className={cn(
        "grid grid-cols-[2fr_min-content_1fr] gap-4 w-full max-w-300 mx-auto px-8",
        className,
      )}
    >
      <div
        className={cn(
          "grow grid content-center gap-y-2 bg-white text-black p-4 rounded-sm",
        )}
      >
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton className="w-3/4" />
        <iframe
          title="Embedded Audio Player Preview"
          frameBorder="0"
          src={`/embed/audio/${embedUrlId}`}
          height="50"
          width="100%"
          className="my-4 bg-transparent"
          allowTransparency
          style={{ colorScheme: "auto" }}
        />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton className="w-3/4" />
      </div>
      <Separator orientation="vertical" />
      <div
        className={cn(
          "grid grid-cols-1 grid-rows-[1fr_min-content] gap-y-2 items-center",
        )}
      >
        <div
          className={cn(
            "grid grid-cols-1 p-4 bg-input rounded-sm text-sm overflow-hidden",
          )}
        >
          <code className={cn("wrap-break-word select-text")}>{embedCode}</code>
        </div>
        <div className={cn("flex justify-end")}>
          <Tooltip>
            <CopyToClipboard text={embedCode} onCopy={handleCopy}>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                  <EmbedCodeCopyIcon /> {EmbedCodeCopyLabel}
                </Button>
              </TooltipTrigger>
            </CopyToClipboard>
            <TooltipContent className="z-(--z-ui)" side="left">
              {EmbedCodeCopyTooltip}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
