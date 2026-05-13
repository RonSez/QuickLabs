import Link from "next/link";
import { nav, site, social } from "@/content/site";
import { products } from "@/content/products";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border bg-bg">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2 max-w-md">
            <Logo size="lg" />
            <p className="mt-5 text-sm text-fg-muted leading-relaxed">
              {site.description}
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-fg-muted">
              {site.email}
            </p>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
              Products
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {products.map((p) => (
                <li key={p.slug}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-fg/80 hover:text-fg transition-colors"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
              Studio
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-fg/80 hover:text-fg transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-8">
          <p className="text-xs text-fg-muted font-mono">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {social.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs font-mono uppercase tracking-[0.18em] text-fg-muted hover:text-fg transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
