"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Menu, X, ShoppingBag, Search, User, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn, formatNumber } from "@/lib/utils";
import SearchOverlay from "@/components/navigation/SearchOverlay";
import MegaMenu from "@/components/layout/MegaMenu";
import CartDropdown from "@/components/layout/CartDropdown";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { totalItems, isReady } = useCart();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
      setQuery("");
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface border-b border-border pt-safe">
        <div className="mx-auto max-w-content px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-4 h-14 sm:h-16">
            <button
              type="button"
              className="lg:hidden flex h-10 w-10 items-center justify-center shrink-0"
              onClick={() => setOpen(true)}
              aria-label="باز کردن منو"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <Link
              href="/"
              className="text-sm sm:text-base font-bold tracking-[0.12em] uppercase shrink-0"
            >
              WebSpeed
            </Link>

            <form
              onSubmit={submitSearch}
              className="hidden sm:flex flex-1 max-w-xl mx-auto"
            >
              <div className="relative w-full">
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در محصولات..."
                  className="w-full h-11 rounded-lg bg-muted border-0 pr-4 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--digi-blue)]/40"
                />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground"
                  aria-label="جستجو"
                >
                  <Search className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-0.5 mr-auto sm:mr-0">
              <button
                type="button"
                className="sm:hidden flex h-10 w-10 items-center justify-center"
                onClick={() => setSearchOpen(true)}
                aria-label="جستجو"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <Link
                href="/profile"
                className="hidden sm:flex h-10 w-10 items-center justify-center text-foreground/70 hover:text-foreground"
                aria-label="پروفایل"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
              </Link>
              <div className="relative">
                <button
                  type="button"
                  className="relative flex h-10 w-10 items-center justify-center text-foreground/70 hover:text-foreground"
                  onClick={() => setCartOpen((v) => !v)}
                  aria-label="سبد خرید"
                >
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                  {isReady && totalItems > 0 && (
                    <span className="absolute top-0.5 left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--discount)] px-1 text-[10px] font-bold text-white leading-none num">
                      {totalItems > 9 ? "۹+" : formatNumber(totalItems)}
                    </span>
                  )}
                </button>
                <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block border-t border-border relative">
          <div className="mx-auto max-w-content px-6 flex items-center h-11 gap-6 text-[13px]">
            <button
              type="button"
              className="flex items-center gap-1 font-semibold hover:text-[var(--discount)]"
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
            >
              دسته‌بندی‌ها
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <Link href="/" className="text-foreground/75 hover:text-foreground">
              خانه
            </Link>
            <Link href="/products?gender=men" className="text-foreground/75 hover:text-foreground">
              مردانه
            </Link>
            <Link href="/products?gender=women" className="text-foreground/75 hover:text-foreground">
              زنانه
            </Link>
            <Link href="/products?sort=newest" className="text-foreground/75 hover:text-foreground">
              جدیدترین
            </Link>
            <Link href="/about" className="text-foreground/75 hover:text-foreground">
              درباره ما
            </Link>
          </div>
          <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-foreground/25 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-[min(20rem,88vw)] bg-surface transition-transform duration-300 pt-safe",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-surface">
            <div className="flex flex-col">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="text-[13px] font-bold tracking-[0.16em] uppercase leading-none"
              >
                WebSpeed
              </Link>
              <span className="text-[10px] text-muted-foreground mt-1">فروشگاه پوشاک</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted"
              aria-label="بستن منو"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col py-2">
            {[
              { href: "/", label: "خانه" },
              { href: "/products?gender=men", label: "مردانه" },
              { href: "/products?gender=women", label: "زنانه" },
              { href: "/products", label: "همه محصولات" },
              { href: "/about", label: "درباره ما" },
              { href: "/contact", label: "تماس" },
              { href: "/profile", label: "پروفایل" },
              { href: "/login", label: "ورود / ثبت‌نام" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-5 py-3 text-[15px] font-medium border-b border-border/50"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
