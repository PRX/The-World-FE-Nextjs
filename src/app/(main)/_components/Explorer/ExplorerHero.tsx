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
        "grid has-[>svg]:grid-cols-[1em_1fr] gap-2 items-start text-3xl font-black text-balance",
        "[&_svg:not([class*='size-'])]:size-[1em]",
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
    <HeroHeader classes={{ content: "max-w-7xl" }} {...props}>
      <div className="grid gap-y-4 text-pretty">{children}</div>
      <Separator />
    </HeroHeader>
  );
}

export default ExplorerHero;
