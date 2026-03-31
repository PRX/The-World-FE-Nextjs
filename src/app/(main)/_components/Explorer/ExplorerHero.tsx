import HeroHeader from "@/app/(main)/_components/HeroHeader";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/util/css";

export type ExplorerHeroHeadingProps = React.ComponentProps<"h1">;
export type ExplorerHeroProps = React.ComponentProps<typeof HeroHeader>;

export function ExplorerHeroHeading({
  className,
  ...props
}: ExplorerHeroHeadingProps) {
  return (
    <h1
      className={cn(
        "flex gap-2 items-center text-3xl font-black",
        "[&_svg:not([class*='size-'])]:size-9",
        className,
      )}
      {...props}
    />
  );
}

export function ExplorerHero({
  className,
  classes,
  children,
  ...props
}: ExplorerHeroProps) {
  return (
    <HeroHeader
      className="px-8 md:ml-(--gutter-left)"
      classes={{ content: "max-w-7xl px-0 md:px-0" }}
      {...props}
    >
      <div className="grid gap-y-4 text-pretty">{children}</div>
      <Separator />
    </HeroHeader>
  );
}

export default ExplorerHero;
