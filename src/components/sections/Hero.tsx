import { copy } from "@/content/copy";

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

function MaskPart({ children, className, index }: { children: React.ReactNode; className?: string; index: number }) {
  return (
    <span className={`inline-block overflow-hidden pr-[0.1em] -mr-[0.1em] pb-[0.06em] align-bottom ${className ?? ""}`}>
      <span data-mask-part className="inline-block" style={delay(index * 80)}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col px-gutter pt-24 short:pt-20 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pt-28"
    >
      <div data-anim="load" className="flex flex-1 flex-col">
        {/* --wm sizes the desktop wordmark by width and height, so it never outgrows a short or wide window. */}
        <div className="flex flex-1 flex-col justify-end gap-8 short:gap-4 lg:items-center lg:justify-center lg:gap-10 lg:[--wm:min(12.5vw,30svh)]">
          <h1 className="font-bold leading-[0.8] tracking-[-0.065em] lg:whitespace-nowrap lg:text-center lg:text-[length:var(--wm)] short:whitespace-nowrap short:text-[10vw]">
            <MaskPart index={0} className="block text-[28vw] short:inline-block short:text-[length:inherit] lg:inline-block lg:text-[length:inherit]">
              Quick
            </MaskPart>
            <MaskPart index={1} className="block text-[28vw] short:inline-block short:text-[length:inherit] lg:inline-block lg:text-[length:inherit]">
              Labs
            </MaskPart>
            <MaskPart
              index={2}
              className="mt-2 block text-[13vw] font-light text-bone/30 short:mt-0 short:inline-block short:text-[length:inherit] lg:mt-0 lg:inline-block lg:text-[length:inherit]"
            >
              /studio
            </MaskPart>
          </h1>
          <p
            data-load-fade
            style={delay(450)}
            className="type-body max-w-[24rem] text-pretty text-bone/80 lg:max-w-[30rem] lg:text-center"
          >
            {copy.hero.line}
          </p>
        </div>

        <div
          data-load-fade
          style={delay(530)}
          className="mt-8 flex items-center justify-between gap-6 border-t border-line pt-4 short:mt-4"
        >
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
