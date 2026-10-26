"use client";

import { useEffect, useRef } from "react";
import { copy } from "@/content/copy";
import { services } from "@/content/services";
import { ensureGsap } from "@/lib/gsap";

export function Services() {
  const ref = useRef<HTMLElement>(null);

  // No hover on touch screens: light up whichever row is crossing the middle of the screen.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const { gsap, ScrollTrigger } = ensureGsap();
    const mm = gsap.matchMedia(root);
    mm.add("(hover: none), (pointer: coarse)", () => {
      root.querySelectorAll(".svc-row").forEach((row) =>
        ScrollTrigger.create({ trigger: row, start: "top 55%", end: "bottom 45%", toggleClass: "is-active" }),
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="services" ref={ref} className="px-gutter py-24 lg:py-36">
      <h2 className="type-label mb-8 text-ash lg:mb-12">{copy.services.label}</h2>
      <ul className="svc-list border-b border-line">
        {services.map((s) => (
          <li
            key={s.title}
            className="svc-row group grid gap-2 border-t border-line py-6 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-baseline lg:gap-10 lg:py-8"
          >
            <h3 className="text-[clamp(2rem,1rem+4.5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] transition-transform duration-300 ease-[var(--ease-out)] lg:group-hover:translate-x-3 motion-safe:group-[.is-active]:translate-x-3">
              {s.title}
            </h3>
            <p className="type-body text-ash lg:text-right">{s.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
