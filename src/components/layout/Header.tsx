"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { nav, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/cn";

type NavItem = (typeof nav)[number];

function NavLink({
  item,
  className,
  onClick,
  style,
}: {
  item: NavItem;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  // Hash links are plain anchors so SmoothScroll can resolve them; page links use next/link.
  if (item.href.includes("#")) {
    return (
      <a href={item.href} className={className} onClick={onClick} style={style}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick} style={style}>
      {item.label}
    </Link>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scrolledRef = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    if (!open) return;
    // Lock both: `html { overflow-x: clip }` stops body overflow from reaching the viewport.
    const root = document.documentElement;
    const prev = document.body.style.overflow;
    const prevRoot = root.style.overflow;
    document.body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    getLenis()?.stop();
    // The page behind the menu leaves the tab order and the accessibility tree.
    const main = document.getElementById("main");
    main?.setAttribute("inert", "");
    // Wait a frame so the menu is visible before it can take focus.
    const raf = requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>("a")?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => {
      if (mq.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prev;
      root.style.overflow = prevRoot;
      main?.removeAttribute("inert");
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const solid = scrolled || open;
  const close = () => setOpen(false);

  return (
    <>
      <a
        href="#main"
        data-native-anchor
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-bone focus:px-4 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-colors duration-300",
          solid ? "border-line bg-ink" : "border-transparent bg-transparent",
        )}
      >
        <div className="flex h-16 items-center justify-between px-gutter lg:h-20">
          <Link
            href="/"
            aria-label={`${site.name}, home`}
            onClick={close}
            className="inline-flex min-h-11 items-center"
          >
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                className="link-draw text-[0.9375rem] text-bone/70 hover:text-bone"
              />
            ))}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="relative -mr-3 inline-flex size-11 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              aria-hidden
              className={cn(
                "absolute h-[1.5px] w-6 bg-bone transition-transform duration-300",
                open ? "rotate-45" : "-translate-y-[4px]",
              )}
            />
            <span
              aria-hidden
              className={cn(
                "absolute h-[1.5px] w-6 bg-bone transition-transform duration-300",
                open ? "-rotate-45" : "translate-y-[4px]",
              )}
            />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-label="Menu"
        data-lenis-prevent
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-between bg-ink px-gutter pt-[calc(5rem+env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] duration-300 md:hidden",
          // Visibility snaps on when opening (so focus can move in) and fades out when closing.
          open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]",
        )}
      >
        <ul className="flex flex-col">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-line">
              <NavLink
                item={item}
                onClick={close}
                style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
                className={cn(
                  "type-heading block py-4 transition-transform duration-500 ease-[var(--ease-out)]",
                  open ? "translate-y-0" : "translate-y-full",
                )}
              />
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${site.email}`}
          className="flex min-h-12 items-center justify-between rounded-[2px] bg-bone px-5 text-[0.9375rem] font-semibold text-ink"
        >
          Email us <span aria-hidden>→</span>
        </a>
      </div>
    </>
  );
}
