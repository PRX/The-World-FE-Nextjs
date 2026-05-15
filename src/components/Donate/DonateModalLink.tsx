import { cn } from "@/lib/util/css";
import { Button } from "@/components/ui/button";

export default function DonateModalLink({
  campaign,
  queryParams,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  campaign: string;
  queryParams?: Record<string, string>;
}) {
  const urlParams = new URLSearchParams({
    campaign,
    ...queryParams,
  });
  const linkHref = `?${urlParams.toString()}`;

  return (
    <Button asChild {...props} className={cn("cursor-pointer", className)}>
      <a href={linkHref} target={`donate-to-the-world:${campaign}`}>
        {children}
      </a>
    </Button>
  );
}
