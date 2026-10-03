"use client";

import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import type { PageBlock } from "@/builder/types";
import { cn } from "@/lib/utils";

type Props = { block: PageBlock };

export function AnnouncementBarBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const text = String(d.text ?? "ارسال رایگان برای سفارش‌های بالای ۲٬۵۰۰٬۰۰۰ تومان");
  const href = String(d.href ?? "/products");
  const bg = String(d.background ?? "#0f172a");
  const color = String(d.textColor ?? "#ffffff");
  return (
    <div
      className="w-full text-center text-xs sm:text-sm py-2.5 px-3"
      style={{ background: bg, color }}
      data-block="announcement-bar"
    >
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
  const showCta = Boolean(d.showCta);
  const ctaLabel = String(d.ctaLabel ?? "خرید");
  const ctaHref = String(d.ctaHref ?? "/products");
  const bg = String(d.background ?? "#ffffff");
  const textColor = String(d.textColor ?? "#111111");
  const borderColor = String(d.borderColor ?? "#E8E8E8");
  const nav = Array.isArray(d.navItems)
    ? (d.navItems as { label: string; href: string }[])
    : [
        { label: "خانه", href: "/" },
        { label: "مردانه", href: "/products?gender=men" },
        { label: "زنانه", href: "/products?gender=women" },
        { label: "درباره ما", href: "/about" },
      ];

  return (
    <header
      className={cn("w-full border-b", sticky && "sticky top-0 z-40")}
      style={{ background: bg, borderColor, color: textColor }}
      data-block="header"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-black/5"
          aria-label="منو"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="text-base sm:text-lg font-bold tracking-tight shrink-0">
          {logoText}
        </Link>
        <nav className="hidden lg:flex items-center gap-5 flex-1">
          {nav.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="text-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1 lg:hidden" />
        <div className="flex items-center gap-1 sm:gap-2">
          {showSearch && (
            <button type="button" className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-black/5" aria-label="جستجو">
              <Search className="h-4 w-4" />
            </button>
          )}
          {showAccount && (
            <Link href="/profile" className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-black/5" aria-label="حساب">
              <User className="h-4 w-4" />
            </Link>
          )}
          {showWishlist && (
            <button type="button" className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-black/5" aria-label="علاقه‌مندی">
              <Heart className="h-4 w-4" />
            </button>
          )}
          {showCart && (
            <Link href="/cart" className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-black/5" aria-label="سبد">
              <ShoppingBag className="h-4 w-4" />
            </Link>
          )}
          {showCta && (
            <Link
              href={ctaHref}
              className="hidden sm:inline-flex h-9 px-3.5 rounded-lg bg-[#111] text-white text-xs font-semibold items-center"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
