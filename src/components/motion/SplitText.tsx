"use client";

import { motion, useReducedMotion } from "motion/react";
import { charItem, charStagger } from "@/lib/motion";
import { cn } from "@/lib/cn";

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

export function SplitText({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn(className)} aria-label={text}>
      <motion.span
        className="inline-block"
        variants={charStagger}
        initial="hidden"
        animate="visible"
        transition={{ delayChildren: delay }}
        aria-hidden
      >
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => (
              <motion.span
                key={ci}
                variants={charItem}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
            {wi < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
