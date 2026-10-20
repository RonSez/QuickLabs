import { copy } from "@/content/copy";
import { principles } from "@/content/approach";
import { MaskText } from "@/components/motion/MaskText";

export function Principles() {
  return (
    <section id="principles" className="border-t border-line px-gutter py-24 lg:py-36">
      <h2 className="type-label mb-10 text-ash lg:mb-16">{copy.principles.label}</h2>
      <div className="grid gap-14 lg:gap-20">
        {principles.map((p) => (
          <article key={p.title} className="grid gap-3 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-end lg:gap-12">
            <MaskText className="text-[clamp(2.25rem,1rem+5vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.05em]">
              {p.title}
            </MaskText>
            <p className="type-body text-ash lg:text-right">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
