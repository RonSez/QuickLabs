"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 16;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const headerSolid = scrolled || menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-300",
          headerSolid
            ? menuOpen
              ? "bg-bg border-b border-border"
              : "bg-bg/85 backdrop-blur-xl border-b border-border"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label={site.name}
            className="shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <Logo size="sm" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-fg-muted hover:text-fg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              href="#contact"
              variant="primary"
              className="hidden sm:inline-flex"
            >
              Get in touch
            </Button>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-fg hover:bg-fg/5 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          "md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-bg transition-[opacity,transform] duration-300 ease-out",
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        <nav
          className="flex flex-col px-5 pt-6 pb-10 gap-1 max-w-7xl mx-auto"
          aria-label="Mobile"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="py-4 px-2 border-b border-border text-2xl font-medium tracking-tight text-fg hover:text-fg-muted transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-8 inline-flex items-center justify-center h-12 rounded-full bg-fg text-bg text-sm font-medium tracking-tight active:scale-[0.98] transition-transform"
          >
            Get in touch
          </Link>
        </nav>
      </div>
    </>
  );
}
