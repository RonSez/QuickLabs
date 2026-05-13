import { copy } from "@/content/copy";
import { principles } from "@/content/approach";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";

export function Approach() {
  return (
    <section
      id="approach"
      className="relative py-24 sm:py-32 border-t border-border"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={copy.approach.eyebrow}
            title={copy.approach.title}
          />
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className="relative h-full rounded-2xl border border-border bg-bg-elev p-8 overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-[0.07] blur-2xl"
                  style={{ background: "var(--accent)" }}
                />
                <div className="relative">
                  <div className="grid place-items-center w-10 h-10 rounded-lg bg-bg border border-border-strong text-accent mb-6">
                    <Icon name={p.icon} size={18} />
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
