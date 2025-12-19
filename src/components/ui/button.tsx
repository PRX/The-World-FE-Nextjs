import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "shrink-0 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md outline-none font-medium transition-all",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  ),
  {
    variants: {
      variant: {
        default: "bg-cyan text-navy-blue hover:bg-cyan/80",
        action:
          "bg-background bg-linear-to-r from-background to-background-end hover:to-background border border-background transition-[--tw-gradient-to]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-accent bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-transparent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        unstyled: "",
      },
      size: {
        default:
          "h-9 px-4 py-2 text-sm has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-6",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 px-6 text-lg has-[>svg]:px-4 ",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  style,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const isUnstyled = variant === "unstyled";

  return (
    <Comp
      data-slot="button"
      style={
        {
          ...style,
          ...(!isUnstyled && {
            "--background": "var(--button-background, var(--color-red))",
            "--background-end":
              "var(--button-background-end, var(--color-purple))",
          }),
        } as React.CSSProperties
      }
      className={
        isUnstyled
          ? className
          : cn(buttonVariants({ variant, size, className }))
      }
      {...props}
    />
  );
}

export { Button, buttonVariants };
