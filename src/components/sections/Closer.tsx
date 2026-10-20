import Link from "next/link";
import { copy } from "@/content/copy";
import { nav, site } from "@/content/site";
import { products } from "@/content/products";

export function splitEmail(email: string): [string, string, string] {
  const [local, domain] = email.split("@");
  const dot = domain.lastIndexOf(".");
  return [`${local}@`, domain.slice(0, dot), domain.slice(dot)];
}

const footerLink = "link-draw inline-flex min-h-11 items-center hover:text-bone";

export function Closer({ intro }: { intro: string }) {
  const mailto = `mailto:${site.email}`;
  const [a, b, c] = splitEmail(site.email);

  return (
    <section
      id="contact"
      className="flex min-h-svh flex-col justify-between gap-16 border-t border-line px-gutter pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pt-32"
    >
      <div>
        <h2 className="type-label text-ash">{copy.closer.label}</h2>
        <p className="type-body mt-4 max-w-[28rem] text-bone/80">{intro}</p>
        <a
          href={mailto}
          className="link-draw mt-10 inline-block text-[15vw] font-bold leading-[0.88] tracking-[-0.055em] [--draw:3px] lg:text-[8vw]"
        >
          <span className="block lg:inline">{a}</span>
          <span className="block lg:inline">{b}</span>
          <span className="block lg:inline">{c}</span>
        </a>
        <a
          href={mailto}
          className="mt-10 flex min-h-12 w-full items-center justify-between rounded-[2px] bg-bone px-5 text-[0.9375rem] font-semibold text-ink lg:hidden"
        >
          {copy.closer.button} <span aria-hidden>→</span>
        </a>
      </div>

      <footer className="type-label grid gap-2 border-t border-line pt-4 text-ash md:grid-cols-3 md:items-center">
        <ul className="flex flex-wrap gap-x-6">
          {products.map((p) => (
            <li key={p.slug}>
              <a href={p.url} target="_blank" rel="noreferrer noopener" className={footerLink}>
                {p.domain}
              </a>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-x-6 md:justify-center">
          {nav.map((item) =>
            item.href.includes("#") ? (
              <li key={item.href}>
                <a href={item.href} className={footerLink}>
                  {item.label}
                </a>
              </li>
            ) : (
              <li key={item.href}>
                <Link href={item.href} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
        <p className="flex min-h-11 items-center md:justify-end">
          © {new Date().getFullYear()} {site.name}
        </p>
      </footer>
    </section>
  );
}
