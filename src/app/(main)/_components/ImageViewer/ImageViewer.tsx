import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
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
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <ImageIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        style={
          {
            "--aspect-ratio": imgAspectRatio,
            "--_m": 8,
            "--content-m": "calc(var(--spacing) * var(--_m))",
            "--max-w":
              "calc(min(var(--max-h) * var(--aspect-ratio), 100dvw - var(--content-m))",
            "--max-h": "calc(100dvh - var(--content-m))",
          } as CSSProperties
        }
        className={cn(
          "overflow-clip border-none bg-black",
          "h-full max-w-(--max-w) max-h-(--max-h) sm:[--_m:40]! sm:aspect-(--aspect-ratio) sm:max-w-(--max-w)",
        )}
      >
        <DialogHeader className="absolute inset-0 bottom-auto z-1 flex justify-items-end">
          <DialogTitle className="sr-only">View Image: {filename}</DialogTitle>
        </DialogHeader>
        <div className="grid">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            quality={100}
            className="object-center object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
