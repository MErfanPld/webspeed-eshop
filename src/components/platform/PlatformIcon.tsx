import {
  BarChart3, CheckCircle2, CreditCard, Globe, Headphones, Image as ImageIcon, LayoutTemplate, Lock, MessageSquare,
  MousePointerClick, Package, Palette, PenTool, Percent, Rocket, Search, Settings, ShieldCheck, Smartphone, Sparkles,
  Store, Truck, Users, Zap,
} from "lucide-react";

/** Icons selectable in django-admin (apps/platform/models.py ICON_CHOICES) */
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  MousePointerClick, Globe, CreditCard, Percent, MessageSquare, Users, Palette, BarChart3, ShieldCheck, Store,
  LayoutTemplate, Smartphone, Rocket, Truck, Search, Zap, Package, Headphones, Lock, Sparkles, PenTool,
  Image: ImageIcon, Settings, CheckCircle2,
};

export default function PlatformIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} />;
}

/** Colorful chip palettes cycled across cards */
export const CHIP_COLORS = [
  "from-[#ff6b6b] to-[#ff9f43] text-white",
  "from-[#7c3aed] to-[#c084fc] text-white",
  "from-[#0ea5e9] to-[#22d3ee] text-white",
  "from-[#10b981] to-[#84cc16] text-white",
  "from-[#f43f5e] to-[#ec4899] text-white",
  "from-[#f59e0b] to-[#facc15] text-white",
];
