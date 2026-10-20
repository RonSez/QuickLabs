export const EASE = { out: "power3.out", inOut: "power4.inOut" } as const;
export const DUR = { micro: 0.2, reveal: 0.8, load: 1 } as const;

export const MOTION_CONDITIONS = {
  pin: "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  play: "(prefers-reduced-motion: no-preference)",
} as const;

export type MotionConditions = { pin: boolean; play: boolean };

/** Inline <head> script: marks <html> before first paint when motion is allowed. */
export const MOTION_BOOT =
  "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}";
