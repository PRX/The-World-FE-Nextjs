import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:px-2.75 focus-visible:border-2 focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]",
        "not-placeholder-shown:aria-valid:border-green not-placeholder-shown:aria-valid:ring-dark-green/50",
        "not-placeholder-shown:aria-invalid:border-destructive not-placeholder-shown:aria-invalid:ring-destructive/20 not-placeholder-shown:dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
