import * as React from "react";

import { cn } from "@/lib/utils";
import LogoGlobe from "@/app/(main)/_components/Logo/LogoGlobe";

function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "@container/card",
        "relative isolate bg-card text-card-foreground flex flex-col justify-end items-stretch gap-4 rounded-sm py-3 shadow-sm",
        "after:absolute after:inset-0 after:-z-1 after:bg-linear-to-t after:to-50% after:from-card/90 after:rounded-sm",
        "group-nth-of-type-[7n+2]/carousel-item:bg-brown",
        "group-nth-of-type-[7n+3]/carousel-item:bg-burnt-orange",
        "group-nth-of-type-[7n+4]/carousel-item:bg-blue",
        "group-nth-of-type-[7n+5]/carousel-item:bg-green",
        "group-nth-of-type-[7n+6]/carousel-item:bg-purple",
        "group-nth-of-type-[7n+7]/carousel-item:bg-red",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 -z-3 rounded-sm overflow-clip">
        <LogoGlobe className="absolute aspect-square h-[85%] top-0 right-0 translate-x-[33.333%] -translate-y-[10%] opacity-10" />
      </div>
      {children}
    </div>
  );
}

function CardImage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="image"
      className={cn(
        "absolute inset-0 -z-2 overflow-clip rounded-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header flex flex-col gap-2 px-4 [.border-b]:pb-4",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-tight font-semibold text-balance", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("absolute top-4 right-4 leading-1", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("px-4 [.border-t]:pt-4", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardImage,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
