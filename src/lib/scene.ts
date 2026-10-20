"use client";

import { ensureGsap } from "@/lib/gsap";

/** Pinned, scrubbed timeline for desktop scenes. `viewports` = scroll distance while pinned. */
export function pinTimeline(root: HTMLElement, viewports: number) {
  const { gsap } = ensureGsap();
  return gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: () => `+=${window.innerHeight * viewports}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

/** Builds a paused timeline and plays it once when `el` reaches `start`. */
export function playOnEnter(
  el: HTMLElement,
  build: (el: HTMLElement) => gsap.core.Timeline,
  start = "top 60%",
) {
  const { ScrollTrigger } = ensureGsap();
  const tl = build(el);
  ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => tl.play() });
}
