import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
};

type AsButton = CommonProps & {
  href?: never;
  type?: "button" | "submit";
  onClick?: () => void;
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 h-11 text-sm font-medium tracking-tight transition-[transform,background-color,border-color,color] duration-200 ease-out will-change-transform active:scale-[0.98]";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-fg text-bg hover:bg-fg/90 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_24px_-12px_rgba(45,139,255,0.6)]",
  secondary:
    "bg-bg-elev text-fg border border-border-strong hover:border-fg/40 hover:bg-bg-elev-2",
  ghost:
    "text-fg/80 hover:text-fg hover:bg-fg/5",
};

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className, children } = props;
  const cls = cn(baseClass, variantClass[variant], className);

  if ("href" in props && props.href) {
    const isProtocolLink = /^(mailto:|tel:|sms:)/.test(props.href);
    if (isProtocolLink) {
      return (
        <a href={props.href} className={cls}>
          {children}
        </a>
      );
    }
    const isExternal = props.external ?? /^https?:\/\//.test(props.href);
    if (isExternal) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noreferrer noopener"
          className={cls}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }

  const { type = "button", onClick } = props as AsButton;
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
