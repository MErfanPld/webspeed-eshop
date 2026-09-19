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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "نمای کلی", icon: LayoutDashboard },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: Tags },
  { href: "/admin/customers", label: "مشتری‌ها", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Nav = (
    <nav className="flex flex-col gap-1 p-4">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {label}
          </Link>
        );
      })}
      <hr className="rule my-3" />
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <Store className="h-4 w-4" strokeWidth={1.5} />
        بازگشت به فروشگاه
      </Link>
    </nav>
  );

  return (
    <>
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-background border-b border-border px-4 h-12">
        <span className="text-sm font-bold tracking-wide">پنل مدیریت</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-10 w-10 flex items-center justify-center"
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
            "absolute top-0 right-0 h-full w-64 bg-background border-l border-border transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-12 px-4 border-b border-border">
            <span className="text-sm font-bold">پنل مدیریت</span>
            <button type="button" onClick={() => setOpen(false)} className="h-10 w-10 flex items-center justify-center">
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
