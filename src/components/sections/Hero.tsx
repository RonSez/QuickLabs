"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { copy } from "@/content/copy";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SplitText } from "@/components/motion/SplitText";
import { easeOut } from "@/lib/motion";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas").then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  }
);

function HeroFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(60% 50% at 50% 40%, var(--accent-glow) 0%, transparent 70%), radial-gradient(40% 35% at 70% 70%, rgba(96,165,250,0.18) 0%, transparent 70%)",
      }}
    />
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden noise-bg pt-32 sm:pt-36 pb-24 sm:pb-32 min-h-[100svh] flex items-center"
    >
      <HeroCanvas />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 -z-10 bg-gradient-to-b from-transparent to-bg"
      />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="font-mono text-[11px] uppercase tracking-[0.24em] text-fg-muted mb-8"
        >
          {copy.hero.eyebrow}
        </motion.div>

        <SplitText
          text={copy.hero.headline}
          className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] max-w-5xl"
          as="h1"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.5 }}
          className="mt-7 max-w-2xl text-base sm:text-lg text-fg-muted leading-relaxed"
        >
          {copy.hero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button href={copy.hero.primaryCta.href} variant="primary">
            {copy.hero.primaryCta.label}
            <ArrowRight />
          </Button>
          <Button href={copy.hero.secondaryCta.href} variant="secondary">
            {copy.hero.secondaryCta.label}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 sm:mt-20 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-fg-muted"
        >
          <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          Two products live · Engineering for hire
        </motion.div>
      </Container>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
