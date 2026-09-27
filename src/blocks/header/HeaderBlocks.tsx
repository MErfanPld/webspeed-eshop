"use client";

import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import type { PageBlock } from "@/builder/types";

type Props = { block: PageBlock };

export function AnnouncementBarBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const text = String(d.text ?? "ارسال رایگان برای سفارش‌های بالای ۲٬۵۰۰٬۰۰۰ تومان");
  const href = String(d.href ?? "/products");
  const bg = String(d.background ?? "#0f172a");
  const color = String(d.textColor ?? "#ffffff");
  return (
    <div className="w-full text-center text-xs sm:text-sm py-2 px-3" style={{ background: bg, color }}>
      <Link href={href} className="hover:underline">{text}</Link>
    </div>
  );
}

export function MainHeaderBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const logoText = String(d.logoText ?? "WebSpeed");
  const sticky = Boolean(d.sticky ?? true);
  const showSearch = d.showSearch !== false;
  const showCart = d.showCart !== false;
  const showAccount = d.showAccount !== false;
  const showWishlist = Boolean(d.showWishlist);
  const nav = Array.isArray(d.navItems)
    ? (d.navItems as { label: string; href: string }[])
    : [
        { label: "خانه", href: "/" },
        { label: "مردانه", href: "/products?gender=men" },
        { label: "زنانه", href: "/products?gender=women" },
        { label: "درباره ما", href: "/about" },
      ];

  return (
    <header className={`w-full border-b border-border bg-white ${sticky ? "sticky top-0 z-40" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3 sm:gap-6">
        <button type="button" className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-muted" aria-label="منو">
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="text-base sm:text-lg font-bold tracking-tight shrink-0">{logoText}</Link>
        <nav className="hidden lg:flex items-center gap-5 flex-1">
          {nav.map((item) => (
            <Link key={item.href + item.label} href={item.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 lg:hidden" />
        <div className="flex items-center gap-1 sm:gap-2">
          {showSearch && (
            <button type="button" className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-muted" aria-label="جستجو">
              <Search className="h-4 w-4" />
            </button>
          )}
          {showAccount && (
            <Link href="/profile" className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-muted" aria-label="حساب">
              <User className="h-4 w-4" />
            </Link>
          )}
          {showWishlist && (
            <button type="button" className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-muted" aria-label="علاقه‌مندی">
              <Heart className="h-4 w-4" />
            </button>
          )}
          {showCart && (
            <Link href="/cart" className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-muted" aria-label="سبد">
              <ShoppingBag className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
