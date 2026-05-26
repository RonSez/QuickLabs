import {
  Sparkles,
  Layers,
  Plug,
  Compass,
  ShieldCheck,
  Workflow,
  Award,
  ArrowUpRight,
  ArrowRight,
  Quote,
  Mail,
  Menu,
  X,
  Palette,
  Smartphone,
  Zap,
  Globe,
  Wrench,
  Server,
  FileText,
  LifeBuoy,
  Gauge,
  Check,
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
  ArrowRight,
  Quote,
  Mail,
  Menu,
  X,
  Palette,
  Smartphone,
  Zap,
  Globe,
  Wrench,
  Server,
  FileText,
  LifeBuoy,
  Gauge,
  Check,
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
