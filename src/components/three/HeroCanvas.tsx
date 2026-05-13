"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ShaderOrb } from "./ShaderOrb";

export function HeroCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onVisibility = () => {
      if (document.hidden) setActive(false);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // pause as soon as hero leaves viewport — canvas is below the fold otherwise
          setActive(entry.isIntersecting && !document.hidden);
        }
      },
      { rootMargin: "100px 0px 100px 0px", threshold: 0 }
    );
    io.observe(el);

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // skip canvas entirely for users who prefer reduced motion
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, var(--accent-glow) 0%, transparent 70%)",
        }}
      />
    );
  }

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="absolute inset-0 -z-10 pointer-events-none"
    >
      <Canvas
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
        camera={{ position: [0, 0, 1], fov: 50 }}
        dpr={[1, 1.25]}
        frameloop={active ? "always" : "never"}
        style={{ background: "transparent" }}
      >
        <ShaderOrb />
      </Canvas>
    </div>
  );
}
