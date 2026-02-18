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
        style={{ "--aspect-ratio": imgAspectRatio } as CSSProperties}
        className={cn(
          "overflow-clip border-none bg-black",
          "sm:max-w-[calc(100dvw-220px)] sm:aspect-(--aspect-ratio)",
          {
            "w-auto h-full max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-220px)]":
              imgAspectRatio !== "none" && imgAspectRatio > 1,
            "h-full max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-220px)]":
              imgAspectRatio === "none",
          },
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
