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

/**
 * Plays a paused animation each time `el` scrolls down to `start`. It rewinds only once
 * `el` is fully back below the viewport, so the reset is never seen and the next scroll
 * down replays it. Returns a function that kills both triggers.
 */
export function replayOnScroll(el: Element, anim: gsap.core.Animation, start = "top 85%") {
  const { ScrollTrigger } = ensureGsap();
  const play = ScrollTrigger.create({
    trigger: el,
    start,
    onEnter: () => {
      if (anim.progress() === 0) anim.play();
    },
  });
  const rewind = ScrollTrigger.create({ trigger: el, start: "top bottom", onLeaveBack: () => anim.pause(0) });
  return () => {
    play.kill();
    rewind.kill();
  };
}

/** Builds a paused timeline and plays it whenever `el` scrolls down to `start`. */
export function playOnEnter(
  el: HTMLElement,
  build: (el: HTMLElement) => gsap.core.Timeline,
  start = "top 60%",
) {
  return replayOnScroll(el, build(el), start);
}
