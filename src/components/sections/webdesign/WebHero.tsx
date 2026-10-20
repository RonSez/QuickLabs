import Link from "next/link";
import { webDesignPage } from "@/content/webdesign";

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

export function WebHero() {
  const h = webDesignPage.hero;

  return (
    <section className="flex min-h-svh flex-col px-gutter pt-24 short:pt-20 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pt-28">
      <div data-anim="load" className="flex flex-1 flex-col justify-between gap-10 short:gap-4">
        <Link
          href="/"
          data-load-fade
          style={delay(450)}
          className="type-label inline-flex min-h-11 items-center gap-2 self-start text-ash hover:text-bone"
        >
          <span aria-hidden>←</span> {h.back}
        </Link>
        <h1 className="text-[clamp(3.5rem,1rem+12vw,13rem)] short:text-[8vw] font-bold leading-[0.84] tracking-[-0.06em]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-mask-part className="inline-block" style={delay(0)}>
              {h.titleA}
            </span>
          </span>{" "}
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-mask-part className="inline-block font-light text-bone/30" style={delay(80)}>
              {h.titleB}
            </span>
          </span>
        </h1>
        <div
          data-load-fade
          style={delay(530)}
          className="flex flex-col gap-6 border-t border-line pt-4 short:flex-row short:items-end short:justify-between lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="type-body max-w-[30rem] text-bone/80">{h.body}</p>
          <a
            href={h.cta.href}
            className="flex min-h-12 items-center justify-between gap-6 rounded-[2px] bg-bone px-5 text-[0.9375rem] font-semibold text-ink"
          >
            {h.cta.label} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
