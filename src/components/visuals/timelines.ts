"use client";

import { ensureGsap } from "@/lib/gsap";
import { EASE } from "@/lib/motion-tokens";

const typeWords = (tl: gsap.core.Timeline, words: NodeListOf<Element> | Element[]) =>
  tl.from(words, { autoAlpha: 0, duration: 0.01, stagger: 0.06, ease: "none" });

export function buildNoteTimeline(el: HTMLElement) {
  const { gsap } = ensureGsap();
  const tl = gsap.timeline({ paused: true });
  typeWords(tl, el.querySelectorAll("[data-w]"));
  return tl;
}

export function buildRedlineTimeline(el: HTMLElement) {
  const { gsap } = ensureGsap();
  const tl = gsap.timeline({ paused: true });
  tl.from(el.querySelector("[data-del]"), {
    color: "#0d0d0b",
    textDecorationColor: "rgba(229,72,77,0)",
    duration: 0.4,
    ease: EASE.out,
  });
  typeWords(tl, el.querySelectorAll("[data-ins] [data-w]"));
  return tl;
}

export function buildSiteTimeline(el: HTMLElement) {
  const { gsap } = ensureGsap();
  const tl = gsap.timeline({ paused: true });
  tl.from(el.querySelectorAll("[data-block]"), {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 0.5,
    ease: EASE.out,
    stagger: 0.12,
  }).from(el.querySelector("[data-cta]"), { backgroundColor: "rgba(236,232,223,0.12)", duration: 0.4 });
  return tl;
}

export function buildReceiptTimeline(el: HTMLElement) {
  const { gsap } = ensureGsap();
  const tl = gsap.timeline({ paused: true });
  tl.from(el.querySelectorAll("[data-item]"), { autoAlpha: 0, y: -6, duration: 0.35, ease: EASE.out, stagger: 0.12 })
    .from(el.querySelector("[data-total]"), { autoAlpha: 0, y: 8, duration: 0.5, ease: EASE.out });
  return tl;
}
