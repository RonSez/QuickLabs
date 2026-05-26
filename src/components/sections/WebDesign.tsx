import Link from "next/link";
import {
  webDesignCopy,
  webDesignServices,
  carePlanItems,
} from "@/content/webdesign";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";

export function WebDesign() {
  return (
    <section
      id="web-design"
      className="relative py-24 sm:py-32 border-t border-border overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.5]"
        style={{
          background:
            "radial-gradient(60% 50% at 85% 15%, color-mix(in oklab, var(--accent) 14%, transparent) 0%, transparent 70%)",
        }}
      />

      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={webDesignCopy.eyebrow}
            title={webDesignCopy.title}
            body={webDesignCopy.body}
          />
        </Reveal>

        <ul className="mt-16 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-2xl overflow-hidden">
          {webDesignServices.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <li className="group relative bg-bg p-6 sm:p-7 h-full transition-colors hover:bg-bg-elev">
                <div className="grid place-items-center w-10 h-10 rounded-lg bg-bg-elev border border-border-strong text-accent mb-5">
                  <Icon name={s.icon} size={18} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                  {s.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-2xl border border-border bg-bg-elev p-7 sm:p-10 overflow-hidden relative">
            <div
              aria-hidden
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.08] blur-2xl"
              style={{ background: "var(--accent)" }}
            />
            <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12 relative">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted mb-4 flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-accent" />
                  {webDesignCopy.carePlan.eyebrow}
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-[1.15]">
                  {webDesignCopy.carePlan.title}
                </h3>
                <p className="mt-4 text-sm sm:text-base text-fg-muted leading-relaxed max-w-md">
                  {webDesignCopy.carePlan.body}
                </p>

                <Link
                  href={webDesignCopy.cta.href}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-accent border-b border-accent/40 pb-1 hover:gap-3 hover:border-accent transition-all"
                >
                  {webDesignCopy.cta.label}
                  <Icon name="ArrowRight" size={14} />
                </Link>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 content-start">
                {carePlanItems.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="shrink-0 grid place-items-center w-6 h-6 rounded-md bg-bg border border-border-strong text-accent">
                      <Icon name="Check" size={12} />
                    </span>
                    <span className="text-fg/85">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
