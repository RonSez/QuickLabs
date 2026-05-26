import type { Metadata } from "next";
import Link from "next/link";
import {
  webDesignPageCopy,
  webDesignServices,
  carePlanItems,
} from "@/content/webdesign";
import { site } from "@/content/site";
import { copy } from "@/content/copy";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Web design & care plan",
  description:
    "Custom-designed, fast, mobile-first websites for businesses — backed by a monthly care plan covering hosting, maintenance, content changes, support, and performance monitoring.",
  openGraph: {
    title: `Web design & care plan — ${site.name}`,
    description:
      "Premium websites designed, built, and looked after by QuickLabs.",
    type: "website",
  },
};

const mail = `${copy.contact.cta.hrefBase}${site.email}`;

export default function WebDesignPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 sm:pt-48 sm:pb-32 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.6]"
          style={{
            background:
              "radial-gradient(60% 60% at 30% 20%, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 70%)",
          }}
        />

        <Container>
          <Reveal>
            <Link
              href="/#web-design"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted hover:text-fg transition-colors mb-8"
            >
              <span aria-hidden>←</span>
              Back to {site.name}
            </Link>
          </Reveal>

          <div className="max-w-3xl">
            <Reveal>
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-fg-muted mb-5 flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-accent" />
                {webDesignPageCopy.eyebrow}
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
                {webDesignPageCopy.title}
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 text-lg sm:text-xl text-fg-muted leading-relaxed max-w-2xl">
                {webDesignPageCopy.body}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="#contact" variant="primary">
                  <Icon name="Mail" size={16} />
                  Get in touch
                </Button>
                <Button href="#care-plan" variant="secondary">
                  See the care plan
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="relative py-24 sm:py-32 border-t border-border">
        <Container>
          <Reveal>
            <div className="max-w-3xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted mb-5">
                Services
              </div>
              <h2 className="text-balance text-3xl sm:text-4xl md:text-[2.75rem] font-semibold tracking-tight leading-[1.1]">
                {webDesignPageCopy.servicesTitle}
              </h2>
              <p className="mt-5 text-base sm:text-lg text-fg-muted leading-relaxed max-w-2xl">
                {webDesignPageCopy.servicesBody}
              </p>
            </div>
          </Reveal>

          <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {webDesignServices.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <li className="group relative h-full rounded-2xl border border-border bg-bg-elev p-7 overflow-hidden transition-colors hover:border-border-strong">
                  <div
                    aria-hidden
                    className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-[0.06] blur-2xl"
                    style={{ background: "var(--accent)" }}
                  />
                  <div className="relative">
                    <div className="grid place-items-center w-11 h-11 rounded-lg bg-bg border border-border-strong text-accent mb-6">
                      <Icon name={s.icon} size={20} />
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted mb-2">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Care plan */}
      <section
        id="care-plan"
        className="relative py-24 sm:py-32 border-t border-border overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(55% 50% at 85% 50%, color-mix(in oklab, var(--accent) 16%, transparent) 0%, transparent 70%)",
          }}
        />

        <Container>
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 items-start">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-fg-muted mb-5 flex items-center gap-3">
                  <span className="size-1.5 rounded-full bg-accent" />
                  Monthly care plan
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                  {webDesignPageCopy.carePlanTitle}
                </h2>
                <p className="mt-5 text-base sm:text-lg text-fg-muted leading-relaxed max-w-xl">
                  {webDesignPageCopy.carePlanBody}
                </p>

                <div className="mt-8">
                  <Button href="#contact" variant="primary">
                    <Icon name="Mail" size={16} />
                    Ask about the care plan
                  </Button>
                </div>
              </Reveal>
            </div>

            <ul className="space-y-3">
              {carePlanItems.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.05}>
                  <li className="group relative rounded-2xl border border-border bg-bg-elev p-6 sm:p-7 transition-colors hover:border-border-strong">
                    <div className="flex items-start gap-5">
                      <div className="shrink-0 grid place-items-center w-10 h-10 rounded-lg bg-bg border border-border-strong text-accent">
                        <Icon name={item.icon} size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold tracking-tight">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="relative py-28 sm:py-36 border-t border-border overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.5]"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 100%, var(--accent-glow) 0%, transparent 70%)",
          }}
        />

        <Container>
          <Reveal>
            <div className="max-w-2xl mx-auto text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted mb-5">
                Contact
              </div>
              <h2 className="text-balance text-3xl sm:text-4xl md:text-[2.75rem] font-semibold tracking-tight leading-[1.1]">
                {webDesignPageCopy.ctaTitle}
              </h2>
              <p className="mt-5 text-base sm:text-lg text-fg-muted leading-relaxed">
                {webDesignPageCopy.ctaBody}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-col items-center gap-4">
              <Button href={mail} variant="primary">
                <Icon name="Mail" size={16} />
                Email us
              </Button>
              <a
                href={mail}
                className="font-mono text-sm text-fg-muted tracking-[0.06em] hover:text-fg transition-colors"
              >
                {site.email}
              </a>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
