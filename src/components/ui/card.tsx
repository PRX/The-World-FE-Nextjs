import type * as React from "react";
import { cn } from "@/lib/utils";
import LogoGlobe from "@/app/(main)/_components/Logo/LogoGlobe";
import Link from "next/link";

function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "@container/card group/card",
        "group-nth-of-type-[7n+2]/carousel-item:[--card:var(--color-brown)]",
        "group-nth-of-type-[7n+3]/carousel-item:[--card:var(--color-burnt-orange)]",
        "group-nth-of-type-[7n+4]/carousel-item:[--card:var(--color-light-blue)]",
        "group-nth-of-type-[7n+5]/carousel-item:[--card:var(--color-green)]",
        "group-nth-of-type-[7n+6]/carousel-item:[--card:var(--color-purple)]",
        "group-nth-of-type-[7n+7]/carousel-item:[--card:var(--color-red)]",
        "relative isolate text-card-foreground flex flex-col justify-end items-stretch gap-4 rounded-sm py-3 shadow-sm",
        "after:absolute after:inset-0 after:-z-1 after:bg-linear-to-t after:to-50% after:from-navy-blue/90 after:rounded-sm",
        "before:absolute before:inset-0 before:-z-9 before:bg-cyan/10 before:rounded-lg before:opacity-0 before:backdrop-blur-sm before:backdrop-brightness-125",
        "hover:before:opacity-100 hover:before:-inset-2 hover:before:transition-all",
        "focus-within:before:opacity-100 focus-within:before:-inset-2 focus-within:before:transition-all",
        className,
      )}
      {...props}
    >
      <div
        className={cn("absolute inset-0 -z-3 bg-card rounded-sm overflow-clip")}
      >
        <LogoGlobe
          className={cn(
            "absolute aspect-square h-[85%] top-0 right-0 translate-x-[33.333%] -translate-y-[10%] transition-transform opacity-10",
            "group-hover/card:scale-95 group-focus-within/card:scale-95",
          )}
        />
      </div>
      {children}
    </div>
  );
}

function CardLink({ href }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className="absolute inset-0 focus-visible:outline-none"
    ></Link>
  );
}

function CardImage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="image"
      className={cn(
        "absolute inset-0 -z-2 overflow-clip rounded-sm [&>img]:transition-transform",
        "group-hover/card:[&>img]:scale-105 group-focus-within/card:[&>img]:scale-105",
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
  CardLink,
  CardImage,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
