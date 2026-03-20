import type { CSSProperties } from "react";
import { cn } from "@/lib/util/css";

export default function LogoGlobe({
  animated,
  className,
  duration,
}: Readonly<{
  animated?: boolean;
  className?: string;
  duration?: string;
}>) {
  const classNames = cn(className, {});
  const styles = {
    ...(!animated && { "--tw-logo-globe--animation-duration": 0 }),
    ...(duration && { "--tw-logo-globe--animation-duration": duration }),
  } as CSSProperties;

  return (
    <svg aria-hidden="true" className={classNames} style={styles}>
      <use href="#tw-logo-globe" />
    </svg>
  );
}
