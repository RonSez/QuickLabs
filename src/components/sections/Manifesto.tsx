import { copy } from "@/content/copy";
import { ScrubWords } from "@/components/motion/ScrubWords";

export function Manifesto() {
  return (
    <section id="manifesto" aria-label="About QuickLabs" className="px-gutter py-28 lg:py-44">
      <ScrubWords
        text={copy.manifesto}
        className="max-w-[22ch] text-[clamp(1.75rem,1rem+3.6vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.035em] sm:max-w-[26ch]"
      />
    </section>
  );
}
