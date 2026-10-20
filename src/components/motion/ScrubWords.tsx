"use client";

import { Fragment, useRef } from "react";
import { ensureGsap } from "@/lib/gsap";
import { useMotion } from "./useMotion";

export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useMotion(ref, (root, c) => {
    if (!c.play) return;
    const { gsap } = ensureGsap();
    gsap.fromTo(
      root.querySelectorAll("[data-word]"),
      { opacity: 0.18 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 45%", scrub: true },
      },
    );
  });

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span data-word>{w}</span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
