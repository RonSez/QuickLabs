import { copy } from "@/content/copy";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32 border-t border-border">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={copy.about.eyebrow}
            title={copy.about.title}
            body={copy.about.body}
          />
        </Reveal>

        <Reveal delay={0.15}>
          <ul className="mt-16 grid gap-6 sm:grid-cols-2 border-t border-border pt-10">
            {copy.about.stats.map((s) => (
              <li key={s.label}>
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-fg-muted leading-relaxed">
                  {s.label}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
