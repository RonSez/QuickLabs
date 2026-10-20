"use client";

import { useRef } from "react";
import Link from "next/link";
import { webOffer } from "@/content/webdesign";
import { pinTimeline, playOnEnter } from "@/lib/scene";
import { useScene } from "@/components/motion/useMotion";
import { SiteAssemble } from "@/components/visuals/SiteAssemble";
import { buildSiteTimeline } from "@/components/visuals/timelines";

export function WebOffer() {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, {
    pin: (root) => {
      const tl = pinTimeline(root, 1);
      tl.add(buildSiteTimeline(root.querySelector<HTMLElement>("[data-site]")!).paused(false));
    },
    play: (root) => playOnEnter(root.querySelector<HTMLElement>("[data-site]")!, buildSiteTimeline),
  });

  return (
    <section
      id="web-offer"
      ref={ref}
      className="grid gap-12 border-t border-line px-gutter py-24 lg:min-h-svh lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pt-24 lg:pb-8"
    >
      <SiteAssemble />
      <div>
        <h2 className="type-label mb-6 text-ash">{webOffer.label}</h2>
        <p className="text-[clamp(2.75rem,1rem+4.5vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.05em]">{webOffer.title}</p>
        <p className="type-body mt-6 max-w-[28rem] text-bone/80">{webOffer.body}</p>
        <dl className="mt-8 border-b border-line">
          {webOffer.ledger.map((row) => (
            <div key={row.item} className="flex justify-between gap-6 border-t border-line py-3 text-[0.9375rem] lg:py-2.5">
              <dt>{row.item}</dt>
              <dd className="text-ash">{row.term}</dd>
            </div>
          ))}
        </dl>
        <Link
          href={webOffer.link.href}
          className="link-draw mt-8 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold"
        >
          {webOffer.link.label} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
