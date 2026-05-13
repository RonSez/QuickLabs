"use client";

import { motion } from "motion/react";
import type { Product } from "@/content/products";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Props = {
  product: Product;
  index: number;
};

export function ProductDetail({ product, index }: Props) {
  const isReverse = index % 2 === 1;
  const accentColor = `var(${product.accentVar})`;
  const accentColor2 = `var(${product.accentVar}-2)`;

  return (
    <section
      className="relative py-24 sm:py-32 border-t border-border overflow-hidden"
      style={
        {
          ["--product-accent" as string]: accentColor,
          ["--product-accent-2" as string]: accentColor2,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.6]"
        style={{
          background: `radial-gradient(60% 50% at ${
            isReverse ? "85%" : "15%"
          } 35%, color-mix(in oklab, ${accentColor} 18%, transparent) 0%, transparent 70%)`,
        }}
      />

      <Container>
        <div
          className={cn(
            "grid gap-12 lg:gap-16 lg:grid-cols-2 items-start",
            isReverse && "lg:[&>*:first-child]:order-2"
          )}
        >
          {/* Left: sticky product header */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-fg-muted mb-5 flex items-center gap-3">
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: accentColor }}
                />
                Product 0{index + 1} / {product.domain}
              </div>

              <h3
                className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]"
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(120deg, var(--fg) 0%, var(--fg) 50%, ${accentColor2} 100%)`,
                  }}
                >
                  {product.name}
                </span>
              </h3>
              <p className="mt-4 text-lg sm:text-xl text-fg-muted leading-relaxed">
                {product.tagline}
              </p>
              <p className="mt-5 text-sm sm:text-base text-fg/80 leading-relaxed max-w-xl">
                {product.blurb}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {product.badges.map((b) => (
                  <Badge key={b}>{b}</Badge>
                ))}
              </div>

              <div className="mt-8">
                <a
                  href={product.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-sm font-medium border-b border-current pb-1 hover:gap-3 transition-all"
                  style={{ color: accentColor }}
                >
                  Visit {product.domain}
                  <Icon name="ArrowUpRight" size={14} />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right: feature list */}
          <ul className="space-y-3">
            {product.features.map((f, i) => (
              <motion.li
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl border border-border bg-bg-elev p-6 sm:p-7 transition-colors hover:border-border-strong"
              >
                <div className="flex items-start gap-5">
                  <div
                    className="shrink-0 grid place-items-center w-9 h-9 rounded-lg font-mono text-xs"
                    style={{
                      background: `color-mix(in oklab, ${accentColor} 16%, transparent)`,
                      color: accentColor2,
                      border: `1px solid color-mix(in oklab, ${accentColor} 30%, transparent)`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base sm:text-lg font-semibold tracking-tight">
                      {f.title}
                    </h4>
                    <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">
                      {f.body}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
