import {
  Sparkles,
  Layers,
  Plug,
  Compass,
  ShieldCheck,
  Workflow,
  Award,
  ArrowUpRight,
  Quote,
  Mail,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Sparkles,
  Layers,
  Plug,
  Compass,
  ShieldCheck,
  Workflow,
  Award,
  ArrowUpRight,
  Quote,
  Mail,
  Menu,
  X,
};

type IconProps = {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
};

export function Icon({ name, className, size = 20, strokeWidth = 1.75 }: IconProps) {
  const Component = map[name] ?? Sparkles;
  return <Component className={className} size={size} strokeWidth={strokeWidth} />;
}
