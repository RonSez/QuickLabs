import { copy } from "@/content/copy";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";

export function Contact() {
  const mail = `${copy.contact.cta.hrefBase}${site.email}`;
  return (
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
          <SectionHeading
            eyebrow={copy.contact.eyebrow}
            title={copy.contact.title}
            body={copy.contact.body}
            align="center"
          />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center gap-4">
            <Button href={mail} variant="primary">
              <Icon name="Mail" size={16} />
              {copy.contact.cta.label}
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
  );
}
