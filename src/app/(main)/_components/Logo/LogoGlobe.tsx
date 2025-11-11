import type { CSSProperties } from "react";
import cn from "@/lib/util/css/cn";

export default function LogoGlobe({
  animated,
  className,
}: Readonly<{
  animated?: boolean;
  className?: string;
  duration?: string;
}>) {
  const classNames = cn(className, {});
  const styles = {
    ...(!animated && { "--tw-logo-globe--animation-duration": 0 }),
  } as CSSProperties;

  return (
    <svg aria-hidden="true" className={classNames} style={styles}>
      <use href="#tw-logo-globe" />
    </svg>
  );
}
