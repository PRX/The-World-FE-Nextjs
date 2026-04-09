import { cn } from "@/lib/util/css";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("h-4 bg-current/10 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
