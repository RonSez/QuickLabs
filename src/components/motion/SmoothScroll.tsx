"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

function scrollToTarget(el: HTMLElement, lenis: Lenis | null, immediate: boolean) {
  if (lenis) lenis.scrollTo(el, { immediate, force: true });
  else el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { gsap, ScrollTrigger } = ensureGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    const update = (time: number) => lenis?.raf(time * 1000);
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, touchMultiplier: 1.5, syncTouch: false });
      setLenis(lenis);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);
    }

    // Same-page anchor links: resolve positions at click time (pins change page height).
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.hasAttribute("data-native-anchor")) return;
      const url = new URL(a.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el, lenis, false);
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    // After fonts load: re-measure triggers, then honour a hash in the URL.
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const id = decodeURIComponent(window.location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (el) scrollToTarget(el, lenis, true);
    });

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(update);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
