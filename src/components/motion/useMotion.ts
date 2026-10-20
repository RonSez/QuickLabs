"use client";

import { useEffect, useLayoutEffect, type DependencyList, type RefObject } from "react";
import { ensureGsap } from "@/lib/gsap";
import { DUR, EASE, MOTION_CONDITIONS, type MotionConditions } from "@/lib/motion-tokens";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Cleanup = void | (() => void);
export type SceneHandler = (root: HTMLElement) => Cleanup;

/**
 * Runs `setup` inside a gsap.matchMedia scoped to `scope`. Re-runs when the pin/play
 * conditions change (resize, rotation, reduced-motion toggle) and reverts every tween,
 * ScrollTrigger and SplitText created inside, plus any returned cleanup.
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (root: HTMLElement, c: MotionConditions) => Cleanup,
  deps: DependencyList = [],
) {
  useIsoLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const { gsap } = ensureGsap();
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_CONDITIONS, (ctx) => setup(root, ctx.conditions as MotionConditions));
    return () => mm.revert();
  }, deps);
}

/** Desktop pin handler, touch play-once handler, nothing under reduced motion. */
export function useScene(
  scope: RefObject<HTMLElement | null>,
  handlers: { pin?: SceneHandler; play?: SceneHandler },
) {
  useMotion(scope, (root, c) => {
    if (c.pin && handlers.pin) return handlers.pin(root);
    if (c.play && handlers.play) return handlers.play(root);
  });
}

/** Load-in for page heroes: masks `[data-mask-part]` up, fades `[data-load-fade]`. */
export function useLoadMask(scope: RefObject<HTMLElement | null>) {
  useMotion(scope, (root, c) => {
    const gate = root.querySelector<HTMLElement>("[data-anim]");
    if (!c.play) {
      if (gate) gate.dataset.anim = "done";
      return;
    }
    const { gsap } = ensureGsap();
    const parts = root.querySelectorAll("[data-mask-part]");
    const fades = root.querySelectorAll("[data-load-fade]");
    gsap.set(parts, { yPercent: 110 });
    gsap.set(fades, { autoAlpha: 0, y: 12 });
    if (gate) gate.dataset.anim = "done";
    gsap.to(parts, { yPercent: 0, duration: DUR.load, ease: EASE.out, stagger: 0.08 });
    gsap.to(fades, { autoAlpha: 1, y: 0, duration: DUR.reveal, ease: EASE.out, delay: 0.45, stagger: 0.08 });
  });
}
