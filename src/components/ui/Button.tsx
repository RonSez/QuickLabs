import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "link";

type CommonProps = {
  /** "secondary" | "ghost" are legacy aliases for "link"; removed in Task 13. */
  variant?: ButtonVariant | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
};

type AsLink = CommonProps & { href: string; external?: boolean };
type AsButton = CommonProps & { href?: never; type?: "button" | "submit"; onClick?: () => void };

const base =
  "inline-flex items-center gap-2 font-semibold tracking-[-0.01em] touch-manipulation transition-[background-color,color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.98]";

const variantClass: Record<ButtonVariant, string> = {
  primary: "min-h-12 justify-between rounded-[2px] bg-bone px-5 text-[0.9375rem] text-ink hover:bg-bone/90",
  link: "min-h-11 text-[0.9375rem] text-bone link-draw",
};

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className, children } = props;
  const v: ButtonVariant = variant === "primary" ? "primary" : "link";
  const cls = cn(base, variantClass[v], className);

  if ("href" in props && props.href) {
    const { href } = props;
    if (/^(mailto:|tel:|#)/.test(href)) {
      return <a href={href} className={cls}>{children}</a>;
    }
    if (/^https?:\/\//.test(href)) {
      const newTab = props.external ?? true;
      return (
        <a href={href} className={cls} {...(newTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}>
          {children}
        </a>
      );
    }
    return <Link href={href} className={cls}>{children}</Link>;
  }

  const { type = "button", onClick } = props as AsButton;
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
