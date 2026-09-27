"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Store,
  Menu,
  X,
  FileText,
  PanelsTopLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "نمای کلی", icon: LayoutDashboard },
  { href: "/admin/pages", label: "صفحات", icon: FileText },
  { href: "/admin/pages", label: "صفحه‌ساز", icon: PanelsTopLeft, match: "/admin/builder" },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: Tags },
  { href: "/admin/customers", label: "مشتری‌ها", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin/builder")) {
    return null;
  }

  const Nav = (
    <nav className="flex flex-col gap-1 p-3 sm:p-4">
      {links.map(({ href, label, icon: Icon, match }) => {
        const isBuilderEntry = label === "صفحه‌ساز";
        const isPagesEntry = label === "صفحات";
        const showActive = isBuilderEntry
          ? pathname.startsWith("/admin/builder")
          : isPagesEntry
            ? pathname.startsWith("/admin/pages")
            : href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);

        return (
          <Link
            key={`${href}-${label}`}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              showActive
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span className="truncate leading-none">{label}</span>
          </Link>
        );
      })}
      <hr className="my-3 border-border" />
      <Link
        href="/"
        className="flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground"
      >
        <Store className="h-4 w-4 shrink-0" strokeWidth={1.5} />
        <span className="truncate leading-none">بازگشت به فروشگاه</span>
      </Link>
    </nav>
  );

  return (
    <>
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-3 bg-background border-b border-border px-4 h-12">
        <span className="text-sm font-bold tracking-wide">پنل مدیریت</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted"
          aria-label="منو"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-foreground/20 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute top-0 right-0 h-full w-[min(18rem,85vw)] bg-background border-l border-border transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-12 px-4 border-b border-border gap-2">
            <span className="text-sm font-bold">پنل مدیریت</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted"
              aria-label="بستن"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          {Nav}
        </aside>
      </div>

      <aside className="hidden lg:flex lg:flex-col lg:w-56 lg:shrink-0 lg:border-l lg:border-border lg:min-h-screen bg-background">
        <div className="h-14 flex items-center px-5 border-b border-border">
          <span className="text-sm font-bold tracking-[0.15em] uppercase">
            WebSpeed
          </span>
        </div>
        {Nav}
      </aside>
    </>
  );
}
