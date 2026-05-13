import { copy } from "@/content/copy";
import { products } from "@/content/products";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ProductDetail } from "./ProductDetail";

export function Products() {
  return (
    <section
      id="products"
      className="relative pt-24 sm:pt-32 pb-48 sm:pb-56 border-t border-border"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={copy.products.eyebrow}
            title={copy.products.title}
            body={copy.products.body}
          />
        </Reveal>
      </Container>

      {products.map((p, i) => (
        <ProductDetail key={p.slug} product={p} index={i} />
      ))}
    </section>
  );
}
