import { copy } from "@/content/copy";
import { services } from "@/content/services";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";

export function Services() {
  return (
    <section
      id="services"
      className="relative py-24 sm:py-32 border-t border-border"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={copy.services.eyebrow}
            title={copy.services.title}
            body={copy.services.body}
          />
        </Reveal>

        <ul className="mt-16 grid gap-px bg-border sm:grid-cols-2 border border-border rounded-2xl overflow-hidden">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <li className="group relative bg-bg p-7 sm:p-8 h-full transition-colors hover:bg-bg-elev">
                <div className="flex items-start gap-5">
                  <div className="shrink-0 grid place-items-center w-10 h-10 rounded-lg bg-bg-elev border border-border-strong text-accent">
                    <Icon name={s.icon} size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
