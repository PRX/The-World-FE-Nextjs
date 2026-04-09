import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/util/css";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export type ImageViewerProps = {
  imageUrl: string;
  altText: string;
  width?: string | number | null;
  height?: string | number | null;
};

export default function ImageViewer({
  imageUrl,
  altText,
  width,
  height,
}: ImageViewerProps) {
  if (!imageUrl?.trim()) return null;

  const url = new URL(imageUrl, "thttps://heworld.org");
  const filename = url.pathname.split("/").pop();
  const imgAspectRatio =
    width && height
      ? parseInt(`${width}`, 10) / parseInt(`${height}`, 10)
      : "none";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer -m-1">
          <ImageIcon />
          <span className="sr-only">View Image: {filename}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        style={
          {
            "--aspect-ratio": imgAspectRatio,
            "--_m": 4,
            "--content-m": "calc(var(--spacing) * var(--_m) * 2)",
            ...(imgAspectRatio !== "none" && imgAspectRatio > 1
              ? {
                  "--max-w":
                    "min(var(--max-h) * var(--aspect-ratio), 100dvw - var(--content-m))",
                  "--max-h":
                    "min((100dvw - var(--content-m)) / var(--aspect-ratio), 100dvh - var(--content-m))",
                }
              : {
                  "--max-w":
                    "min((100dvh - var(--content-m)) * var(--aspect-ratio), 100dvw - var(--content-m))",
                  "--max-h":
                    "min(var(--max-w) / var(--aspect-ratio), 100dvh - var(--content-m)",
                }),
          } as CSSProperties
        }
        className={cn(
          "overflow-clip border-none bg-black",
          "h-full max-w-(--max-w) max-h-(--max-h) sm:[--_m:20]! sm:aspect-(--aspect-ratio) sm:max-w-(--max-w)",
        )}
      >
        <DialogTitle className="sr-only absolute">
          Viewing Image: {filename}
        </DialogTitle>
        <DialogDescription className="grid">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            quality={100}
            className="object-center object-contain"
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
