"use client";

import { useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion-tokens";
import { replayOnScroll } from "@/lib/scene";
import { useMotion } from "./useMotion";

type Props = { as?: "ul" | "div"; className?: string; children: React.ReactNode };

export function RevealGroup({ as: Tag = "ul", className, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root, c) => {
    if (!c.play) return;
    const { gsap } = ensureGsap();
    const tween = gsap.from(root.children, {
      autoAlpha: 0,
      y: 24,
      duration: DUR.reveal,
      ease: EASE.out,
      stagger: 0.04,
      paused: true,
    });
    return replayOnScroll(root, tween);
  });

  const Comp = Tag as React.ElementType;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
