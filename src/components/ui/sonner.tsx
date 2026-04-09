"use client";

import { cn } from "@/lib/util/css";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            "group/toast relative overflow-clip flex items-start gap-2 p-4 pl-6 border-2 border-cyan rounded-md bg-linear-to-br from-50% from-navy-blue/50 to-blue/80 backdrop-blur-lg shadow-lg",
            "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-2 before:bg-cyan before:from-light-blue before:to-green",
          ),
          // content: "flex flex-col gap-y-1 items-start",
          title: cn("w-fit text-sm font-bold text-cyan"),
          icon: cn("relative text-light-blue size-5"),
          description: "text-xs mt-1",
          actionButton: "",
          cancelButton: "",
          closeButton: cn(
            "absolute grid place-items-center size-5 -top-px -right-px !bg-transparent hover:!bg-blue rounded-tr-md rounded-bl-md border !border-none cursor-pointer",
          ),
        },
        ...toastOptions,
      }}
      {...props}
    />
  );
};

export { Toaster };
