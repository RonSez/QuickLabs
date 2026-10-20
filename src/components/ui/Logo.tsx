import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-[1.125rem] font-bold tracking-[-0.03em] text-bone", className)}>
      QuickLabs
    </span>
  );
}
