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
  UsersRound,
  KeyRound,
  MessageSquare,
  History,
  GraduationCap,
  CreditCard,
  Globe,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: string;
  disabled?: boolean;
  badge?: string;
  /** only for platform admins (superusers) */
  platformAdmin?: boolean;
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
      { href: "/admin/brands", label: "برندها", icon: CircleDot },
      { href: "/admin/reviews", label: "نظرات", icon: MessageSquare },
    ],
  },
  {
    title: "فروش",
    items: [
      { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
      { href: "/admin/customers", label: "مشتری‌ها", icon: Users },
      { href: "/admin/coupons", label: "تخفیف‌ها", icon: Percent },
    ],
  },
  {
    title: "محتوا",
    items: [
      { href: "/admin/pages", label: "صفحات", icon: FileText },
      { href: "/admin/pages", label: "صفحه‌ساز", icon: PanelsTopLeft, match: "/admin/builder" },
      { href: "/admin/media", label: "رسانه", icon: Image },
    ],
  },
  {
    title: "ظاهر",
    items: [{ href: "/admin/theme", label: "تم و ظاهر", icon: Palette }],
  },
  {
    title: "تنظیمات",
    items: [
      { href: "/admin/settings", label: "تنظیمات فروشگاه", icon: Settings },
      { href: "/admin/team", label: "اعضای تیم", icon: UsersRound },
      { href: "/admin/stores", label: "فروشگاه‌ها", icon: Store },
      { href: "/admin/billing", label: "اشتراک و پلن", icon: CreditCard },
      { href: "/admin/account", label: "حساب و رمز عبور", icon: KeyRound },
      { href: "/admin/audit", label: "گزارش فعالیت", icon: History },
      { href: "/admin/help", label: "آموزش و راهنما", icon: GraduationCap },
      { href: "/admin/platform", label: "مدیریت پلتفرم", icon: Globe, platformAdmin: true },
      { href: "/", label: "مشاهده فروشگاه", icon: Search },
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
  if (pathname.startsWith("/admin/theme")) return "تم و ظاهر";
  if (pathname.startsWith("/admin/settings")) return "تنظیمات فروشگاه";
  if (pathname.startsWith("/admin/media")) return "رسانه";
  if (pathname.startsWith("/admin/stores")) return "فروشگاه‌ها";
  if (pathname.startsWith("/admin/team")) return "اعضای تیم";
  if (pathname.startsWith("/admin/account")) return "حساب کاربری";
  if (pathname.startsWith("/admin/brands")) return "برندها";
  if (pathname.startsWith("/admin/coupons")) return "کدهای تخفیف";
  if (pathname.startsWith("/admin/reviews")) return "نظرات";
  if (pathname.startsWith("/admin/audit")) return "گزارش فعالیت";
  if (pathname.startsWith("/admin/help")) return "آموزش و راهنما";
  if (pathname.startsWith("/admin/billing")) return "اشتراک و پلن";
  if (pathname.startsWith("/admin/platform")) return "مدیریت پلتفرم";
  return "پنل مدیریت";
}
