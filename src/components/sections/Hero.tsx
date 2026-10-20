"use client";

import { useRef } from "react";
import { copy } from "@/content/copy";
import { useLoadMask } from "@/components/motion/useMotion";

function MaskPart({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block overflow-hidden pb-[0.06em] align-bottom ${className ?? ""}`}>
      <span data-mask-part className="inline-block">
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useLoadMask(ref);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh flex-col px-gutter pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pt-28"
    >
      <div data-anim="pending" className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-end gap-8 lg:justify-between">
          <p
            data-load-fade
            className="type-body order-2 max-w-[24rem] text-bone/80 lg:order-1 lg:self-end lg:text-right"
          >
            {copy.hero.line}
          </p>
          <h1 className="order-1 font-bold leading-[0.8] tracking-[-0.065em] lg:order-2 lg:-ml-[0.04em] lg:whitespace-nowrap lg:text-[14.5vw]">
            <MaskPart className="block text-[28vw] lg:inline-block lg:text-[length:inherit]">Quick</MaskPart>
            <MaskPart className="block text-[28vw] lg:inline-block lg:text-[length:inherit]">Labs</MaskPart>
            <MaskPart className="mt-2 block text-[13vw] font-light text-bone/30 lg:mt-0 lg:inline-block lg:text-[length:inherit]">
              /studio
            </MaskPart>
          </h1>
        </div>

        <div data-load-fade className="mt-8 flex items-center justify-between gap-6 border-t border-line pt-4">
          <span className="type-label hidden text-ash lg:inline">Scroll</span>
          <a
            href={copy.hero.cta.href}
            className="flex min-h-12 w-full items-center justify-between rounded-[2px] bg-bone px-5 text-[0.9375rem] font-semibold text-ink lg:hidden"
          >
            {copy.hero.cta.label} <span aria-hidden>→</span>
          </a>
          <a
            href={copy.hero.cta.href}
            className="link-draw hidden min-h-11 items-center gap-2 text-[0.9375rem] font-semibold lg:inline-flex"
          >
            {copy.hero.cta.label} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
