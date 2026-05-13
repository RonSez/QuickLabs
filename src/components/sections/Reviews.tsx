import { copy } from "@/content/copy";
import { reviews } from "@/content/reviews";
import { products } from "@/content/products";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";

function accentForSlug(slug: string): string {
  const p = products.find((x) => x.slug === slug);
  if (!p) return "var(--accent)";
  return `var(${p.accentVar})`;
}

function productNameForSlug(slug: string): string | null {
  const p = products.find((x) => x.slug === slug);
  return p?.name ?? null;
}

export function Reviews() {
  return (
    <section
      id="reviews"
      className="relative py-24 sm:py-32 border-t border-border"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={copy.reviews.eyebrow}
            title={copy.reviews.title}
            body={copy.reviews.body}
          />
        </Reveal>

        <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => {
            const accent = accentForSlug(r.productSlug);
            const productName = productNameForSlug(r.productSlug);
            return (
              <Reveal key={i} delay={(i % 3) * 0.06}>
                <article className="group relative h-full rounded-2xl border border-border bg-bg-elev p-7 transition-colors hover:border-border-strong">
                  <Icon
                    name="Quote"
                    size={20}
                    className="mb-5"
                    /* lucide doesn't accept style, but className passes through; we tint via CSS color */
                  />
                  <span
                    aria-hidden
                    className="absolute top-7 left-7 size-5 rounded-sm"
                    style={{
                      background: `color-mix(in oklab, ${accent} 25%, transparent)`,
                      maskImage: "none",
                      filter: "blur(8px)",
                      pointerEvents: "none",
                    }}
                  />
                  <p className="relative text-base text-fg/90 leading-relaxed">
                    “{r.quote}”
                  </p>
                  <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                    <div className="text-sm text-fg-muted">{r.author}</div>
                    {productName && (
                      <span
                        className="font-mono text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: accent }}
                      >
                        {productName}
                      </span>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
