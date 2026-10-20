"use client";

import { useRef } from "react";
import { webDesignPage } from "@/content/webdesign";
import { playOnEnter } from "@/lib/scene";
import { useScene } from "@/components/motion/useMotion";
import { Receipt } from "@/components/visuals/Receipt";
import { buildReceiptTimeline } from "@/components/visuals/timelines";

export function CarePlan() {
  const ref = useRef<HTMLElement>(null);
  const care = webDesignPage.care;

  useScene(ref, {
    play: (root) =>
      playOnEnter(root.querySelector<HTMLElement>("[data-receipt]")!, buildReceiptTimeline, "top 75%"),
  });

  return (
    <section
      id="care-plan"
      ref={ref}
      className="grid gap-12 border-t border-line px-gutter py-24 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-36"
    >
      <div>
        <h2 className="type-label mb-6 text-ash">{care.label}</h2>
        <p className="type-display">{care.title}</p>
        <p className="type-body mt-6 max-w-[28rem] text-bone/80">{care.body}</p>
      </div>
      <div className="lg:w-full lg:max-w-[30rem] lg:justify-self-end">
        <Receipt {...care.receipt} />
      </div>
    </section>
  );
}
