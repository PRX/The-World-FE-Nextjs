import type * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "./separator";

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      style={
        {
          "--popover": "hsl(0 0% 0% / 0)",
        } as React.CSSProperties
      }
      className={cn(
        "group/navigation-menu relative justify-stretch items-center",
        className,
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  size = "normal",
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List> & {
  size?: "normal" | "minimized" | "compact";
}) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      data-size={size}
      className={cn(
        "group flex gap-1 list-none data-[size=compact]:justify-center data-[size=compact]:gap-2 data-[size=compact]:my-4",
        "data-[orientation=vertical]:flex-col",
        // Size: Compact
        "data-[size=compact]:[&>li>:where(a,button)]:grid data-[size=compact]:[&>li>:where(a,button)]:grid-rows-[repeat(2,min-content)] data-[size=compact]:[&>li>:where(a,button)]:justify-items-center data-[size=compact]:[&>li>:where(a,button)]:items-start data-[size=compact]:[&>li>:where(a,button)]:w-auto data-[size=compact]:[&>li>:where(a,button)]:p-2 data-[size=compact]:[&>li>:where(a,button)]:rounded-sm data-[size=compact]:[&>li>:where(a,button)]:text-sm data-[size=compact]:[&>li>:where(a,button)]:font-medium",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn(
        "relative grid group-data-[size=compact]:grid group-data-[size=compact]:px-3",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <li className="self-stretch">
      <Separator
        className={cn(
          "bg-transparent bg-linear-to-r from-border to-border/0",
          className,
        )}
        {...props}
      />
    </li>
  );
}

const navigationMenuTriggerStyle = cva([
  "group flex items-center justify-center rounded-sm bg-background px-4 py-2 disabled:pointer-events-none disabled:opacity-50 outline-none transition-[color,box-shadow]",
  "hover:bg-accent hover:text-white focus-visible:bg-accent focus-visible:text-white",
  // Size: Normal.
  "group-data-[size=normal]:data-[state=open]:hover:bg-accent group-data-[size=normal]:data-[state=open]:text-accent-foreground group-data-[size=normal]:data-[state=open]:focus:bg-accent group-data-[size=normal]:data-[state=open]:bg-accent/50 group-data-[size=normal]:focus-visible:ring-ring/50 group-data-[size=normal]:focus-visible:ring-[3px] group-data-[size=normal]:focus-visible:outline-1",
]);

function NavigationMenuTrigger({
  className,
  children,
  indicator = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> & {
  indicator?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      {indicator && (
        <ChevronDownIcon
          className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      )}
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      style={
        {
          "--popover": "hsl(0 0% 0% / 0)",
          "--separator-start": "transparent",
          "--separator-end":
            "color-mix(in oklch, var(--color-cyan) 50%, transparent)",
        } as React.CSSProperties
      }
      className={cn(
        "top-0 left-0 relative pe-0.5 md:absolute md:w-auto md:mask-[linear-gradient(to_right,transparent,black_var(--blur-lg))] md:backdrop-blur-lg",
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        "group-data-[orientation=horizontal]:data-[motion=from-end]:slide-in-from-right-52 group-data-[orientation=horizontal]:data-[motion=from-start]:slide-in-from-left-52 group-data-[orientation=horizontal]:data-[motion=to-end]:slide-out-to-right-52 group-data-[orientation=horizontal]:data-[motion=to-start]:slide-out-to-left-52",
        "group-data-[orientation=vertical]:data-[motion=from-end]:slide-in-from-bottom-12 group-data-[orientation=vertical]:data-[motion=from-start]:slide-in-from-top-12 group-data-[orientation=vertical]:data-[motion=to-end]:slide-out-to-bottom-12 group-data-[orientation=vertical]:data-[motion=to-start]:slide-out-to-top-12",

        // Link focus overrides.
        "**:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",

        // Viewport: False.
        "group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:top-0 group-data-[viewport=false]/navigation-menu:left-full group-data-[viewport=false]/navigation-menu:mt-0 group-data-[viewport=false]/navigation-menu:overflow-visible group-data-[viewport=false]/navigation-menu:isolate",

        // - State Animation.
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:duration-200",
        className,
      )}
      {...props}
    >
      <div
        className={cn("absolute inset-0 -z-1 bg-popover rounded-sm")}
        {...props}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-tr-sm rounded-br-sm border border-t-2 border-r-2 border-green",
          )}
        />
        <div
          className={cn(
            "absolute inset-0 rounded-tr-sm rounded-br-sm border border-t-2 border-r-2 border-purple mask-t-from-0",
          )}
        />
      </div>
      {children}
    </NavigationMenuPrimitive.Content>
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-0 left-full isolate z-50 flex justify-center",
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-visible rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex gap-2 items-center rounded-sm p-2 transition-all outline-none text-base font-bold whitespace-nowrap",
        "hover:bg-accent hover:text-white hover:backdrop-blur-sm focus:backdrop-blur-sm focus:bg-accent/40 focus:text-white focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1",
        "[&_svg:not([class*='text-'])]:text-current [&_svg:not([class*='size-'])]:size-6",
        "group-data-[size=compact]:rounded-l-none group-data-[size=compact]:pl-(--blur-lg)",
        "data-[active=true]:focus:bg-accent/80 data-[active=true]:hover:bg-accent/80 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuLinkSeparator({
  className,
  from = "start",
  ...props
}: React.ComponentProps<typeof Separator> & { from?: "start" | "end" }) {
  return (
    <Separator
      className={cn(
        "bg-transparent from-border/50 to-border/0",
        {
          "bg-linear-to-r": from === "start",
          "bg-linear-to-l": from === "end",
        },
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuItemSeparator,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuLinkSeparator,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
