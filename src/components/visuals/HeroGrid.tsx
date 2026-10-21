"use client";

import { useEffect, useRef } from "react";

const QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Faint hero grid; on desktop a soft light follows the cursor across the lines. */
export function HeroGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    const host = grid?.parentElement;
    if (!grid || !host || !window.matchMedia(QUERY).matches) return;

    let raf = 0;
    let x = 0, y = 0, tx = 0, ty = 0;
    const tick = () => {
      // Ease toward the cursor so the light trails it slightly.
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      grid.style.setProperty("--mx", `${x.toFixed(1)}px`);
      grid.style.setProperty("--my", `${y.toFixed(1)}px`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!grid.hasAttribute("data-active")) {
        x = tx;
        y = ty;
        grid.setAttribute("data-active", "");
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => grid.removeAttribute("data-active");

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} data-hero-grid aria-hidden="true" className="hero-grid" />;
}
