import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  FileText,
  PanelsTopLeft,
  Settings,
  Image,
  Percent,
  Store,
  Palette,
  Search,
  CircleDot,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: string;
  disabled?: boolean;
  badge?: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const adminNav: NavSection[] = [
  {
    title: "نمای کلی",
    items: [{ href: "/admin", label: "داشبورد", icon: LayoutDashboard }],
  },
  {
    title: "کاتالوگ",
    items: [
      { href: "/admin/products", label: "محصولات", icon: Package },
      { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: Tags },
      { href: "/admin/brands", label: "برندها", icon: CircleDot, disabled: true },
    ],
  },
  {
    title: "فروش",
    items: [
      { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
      { href: "/admin/customers", label: "مشتری‌ها", icon: Users },
      { href: "/admin/discounts", label: "تخفیف‌ها", icon: Percent, disabled: true },
    ],
  },
  {
    title: "محتوا",
    items: [
      { href: "/admin/pages", label: "صفحات", icon: FileText },
      { href: "/admin/pages", label: "صفحه‌ساز", icon: PanelsTopLeft, match: "/admin/builder" },
      { href: "/admin/media", label: "رسانه", icon: Image, disabled: true },
    ],
  },
  {
    title: "ظاهر",
    items: [{ href: "/admin/theme", label: "قالب", icon: Palette, disabled: true }],
  },
  {
    title: "تنظیمات",
    items: [
      { href: "/admin/settings", label: "عمومی", icon: Settings, disabled: true },
      { href: "/admin/settings/seo", label: "سئو", icon: Search, disabled: true },
      { href: "/", label: "فروشگاه", icon: Store },
    ],
  },
];

export function pageTitleFromPath(pathname: string): string {
  if (pathname === "/admin") return "داشبورد";
  if (pathname.startsWith("/admin/products")) return "محصولات";
  if (pathname.startsWith("/admin/categories")) return "دسته‌بندی‌ها";
  if (pathname.startsWith("/admin/orders")) return "سفارش‌ها";
  if (pathname.startsWith("/admin/customers")) return "مشتری‌ها";
  if (pathname.startsWith("/admin/pages")) return "صفحات";
  if (pathname.startsWith("/admin/builder")) return "صفحه‌ساز";
  if (pathname.startsWith("/admin/settings")) return "تنظیمات";
  return "پنل مدیریت";
}
