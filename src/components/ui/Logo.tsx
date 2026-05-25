import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
};

const sizes: Record<NonNullable<LogoProps["size"]>, { h: number; w: number }> = {
  sm: { h: 64, w: 64 },
  md: { h: 56, w: 56 },
  lg: { h: 80, w: 80 },
};

export function Logo({ className, size = "sm", priority = false }: LogoProps) {
  const { h, w } = sizes[size];
  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ height: h }}
    >
      <Image
        src="/quicklabslogo.png"
        alt="QuickLabs — Software Development"
        width={w * 2}
        height={h * 2}
        priority={priority}
        sizes={`${w}px`}
        style={{
          height: h,
          width: "auto",
          objectFit: "contain",
          display: "block",
        }}
      />
    </span>
  );
}
