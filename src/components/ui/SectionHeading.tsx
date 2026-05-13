import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className,
}: Props) {
  const isCenter = align === "center";
  return (
    <div
      className={cn(
        "max-w-3xl",
        isCenter && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted",
            isCenter ? "justify-center" : ""
          )}
        >
          {eyebrow}
        </div>
      )}
      <h2 className="text-balance text-3xl sm:text-4xl md:text-[2.75rem] font-semibold tracking-tight leading-[1.1]">
        {title}
      </h2>
      {body && (
        <p className="mt-5 text-pretty text-base sm:text-lg text-fg-muted leading-relaxed max-w-2xl [&]:[text-wrap:pretty]">
          {body}
        </p>
      )}
    </div>
  );
}
