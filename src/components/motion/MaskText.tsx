"use client";

import { useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion-tokens";
import { useMotion } from "./useMotion";

type Props = { as?: "h2" | "h3" | "p"; className?: string; children: string };

export function MaskText({ as: Tag = "h3", className, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root, c) => {
    if (!c.play) return;
    const { gsap, SplitText } = ensureGsap();
    SplitText.create(root, {
      type: "lines",
      mask: "lines",
      linesClass: "mask-line",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: DUR.reveal,
          ease: EASE.out,
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        }),
    });
  });

  const Comp = Tag as React.ElementType;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
