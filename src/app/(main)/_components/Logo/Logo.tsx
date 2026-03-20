import { cn } from "@/lib/util/css";
import LogoGlobe from "./LogoGlobe";

export default function Logo({
  animated,
  className,
  duration = "1s",
}: Readonly<{
  animated?: boolean;
  className?: string;
  duration?: string;
}>) {
  const classNames = cn(
    className,
    "flex justify-start items-center gap-[0.25em]",
    {},
  );

  return (
    <div className={classNames}>
      <LogoGlobe
        className="aspect-square h-[2em]"
        {...{ animated, duration }}
      />
      <svg className="inline-block h-[1.25em]" viewBox="0 0 300 46">
        <title>The World from PRX</title>
        <use href="#tw-logo-text" />
      </svg>
    </div>
  );
}
