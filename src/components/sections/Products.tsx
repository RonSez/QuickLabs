"use client";

import { useRef } from "react";
import { copy } from "@/content/copy";
import { products, type Product } from "@/content/products";
import { ensureGsap } from "@/lib/gsap";
import { pinTimeline, playOnEnter } from "@/lib/scene";
import { useScene } from "@/components/motion/useMotion";
import { TypewriterNote } from "@/components/visuals/TypewriterNote";
import { RedlineDoc } from "@/components/visuals/RedlineDoc";
import { buildNoteTimeline, buildRedlineTimeline } from "@/components/visuals/timelines";

const buildFor = (p: Product) => (p.screen.kind === "note" ? buildNoteTimeline : buildRedlineTimeline);

function Chapter({ product, index }: { product: Product; index: number }) {
  const dot = product.name.indexOf(".");
  return (
    <article
      data-chapter={product.slug}
      style={{ ["--product" as string]: `var(--${product.slug})` }}
      className="grid gap-10 border-t border-line px-gutter py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 group-data-[pinned]:h-svh group-data-[pinned]:border-t-0 group-data-[pinned]:py-0 group-data-[pinned]:[grid-area:1/1]"
    >
      <div className="flex flex-col gap-6">
        <p className="type-label text-ash">
          Product 0{index + 1} · {product.vertical}
        </p>
        <h3 className="type-display">
          {product.name.slice(0, dot)}
          <br />
          {product.name.slice(dot)}
        </h3>
        <p className="type-body max-w-[30rem] text-bone/80">{product.tagline}</p>
        <p className="type-label text-ash">{product.facts}</p>
        <a
          href={product.url}
          target="_blank"
          rel="noreferrer noopener"
          className="link-draw inline-flex min-h-11 items-center gap-2 self-start text-[0.9375rem] font-semibold"
        >
          {copy.products.visit} {product.domain} <span aria-hidden>↗</span>
        </a>
        <div className="flex max-w-[16rem] gap-1.5" aria-hidden>
          {products.map((p, i) => (
            <span key={p.slug} className={`h-0.5 flex-1 ${i === index ? "bg-[var(--product)]" : "bg-bone/15"}`} />
          ))}
        </div>
      </div>
      <div data-screen aria-hidden>
        {product.screen.kind === "note" ? (
          <TypewriterNote screen={product.screen} />
        ) : (
          <RedlineDoc screen={product.screen} />
        )}
      </div>
    </article>
  );
}

export function Products() {
  const ref = useRef<HTMLElement>(null);

  useScene(ref, {
    pin: (root) => {
      root.dataset.pinned = "";
      const { gsap } = ensureGsap();
      const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
      const tl = pinTimeline(root, 2);
      chapters.forEach((chapter, i) => {
        const screen = chapter.querySelector<HTMLElement>("[data-screen]")!;
        if (i > 0) {
          gsap.set(chapter, { autoAlpha: 0 });
          tl.to(chapters[i - 1], { autoAlpha: 0, duration: 0.3 }).to(chapter, { autoAlpha: 1, duration: 0.3 }, "<");
        }
        tl.add(buildFor(products[i])(screen).paused(false));
      });
      return () => {
        delete root.dataset.pinned;
      };
    },
    play: (root) => {
      root.querySelectorAll<HTMLElement>("[data-chapter]").forEach((chapter, i) => {
        playOnEnter(chapter.querySelector<HTMLElement>("[data-screen]")!, buildFor(products[i]));
      });
    },
  });

  return (
    <section id="products" ref={ref} className="group relative bg-ink">
      <h2 className="sr-only">{copy.products.label}</h2>
      <div className="group-data-[pinned]:grid">
        {products.map((p, i) => (
          <Chapter key={p.slug} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
