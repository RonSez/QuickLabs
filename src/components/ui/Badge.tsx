import { cn } from "@/lib/cn";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
};

export function Badge({ children, className, variant = "outline" }: BadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.12em] leading-none";
  const variantCls =
    variant === "default"
      ? "bg-fg/10 text-fg"
      : "border border-border-strong text-fg/70";
  return <span className={cn(base, variantCls, className)}>{children}</span>;
}
