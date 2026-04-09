"use client";

/**
 * @file Marquee.tsx
 * Component to display text, animating the text side-to-side when it overflows.
 */

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/util/css";

export type MarqueeProps = React.ComponentProps<"div">;

export const Marquee = ({ children, className }: MarqueeProps) => {
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const [marqueeSpeed, setMarqueeSpeed] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const updateMarqueeOffset = useCallback(() => {
    const rootRec = rootRef.current?.getBoundingClientRect();
    const contentRec = contentRef.current?.getBoundingClientRect();

    if (!rootRec || !contentRec) return;

    const offset = Math.min(Math.ceil(rootRec.width - contentRec.width), 0);
    const speed = Math.abs(offset / 200) * 5;

    setMarqueeOffset(offset);
    setMarqueeSpeed(speed);
  }, []);

  const handleResize = useCallback(() => {
    updateMarqueeOffset();
  }, [updateMarqueeOffset]);

  useEffect(() => {
    updateMarqueeOffset();

    timeoutRef.current = setTimeout(() => {
      updateMarqueeOffset();
    }, 1000);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [handleResize, updateMarqueeOffset]);

  return (
    <div className="overflow-hidden inline-block leading-none" ref={rootRef}>
      <motion.div
        ref={contentRef}
        className={cn(
          "relative inline-block whitespace-nowrap px-2",
          className,
        )}
        animate={{ x: [0, marqueeOffset] }}
        initial={{ x: 0 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5,
          delay: 1,
          duration: marqueeSpeed,
          // ease: 'linear'
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
