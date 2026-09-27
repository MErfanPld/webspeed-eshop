"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  User,
  Heart,
  ChevronDown,
  Home,
  Grid3X3,
  Tag,
  Phone,
  Info,
  LogIn,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn, formatNumber } from "@/lib/utils";
import SearchOverlay from "@/components/navigation/SearchOverlay";
import MegaMenu from "@/components/layout/MegaMenu";
import CartDropdown from "@/components/layout/CartDropdown";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/", label: "خانه" },
  { href: "/products?sort=bestsellers", label: "پرفروش‌ها" },
  { href: "/products?sort=newest", label: "جدیدترین‌ها" },
  { href: "/products?gender=men", label: "مردانه" },
  { href: "/products?gender=women", label: "زنانه" },
  { href: "/products", label: "همه محصولات" },
  { href: "/products?discount=1", label: "تخفیف‌ها", accent: true },
];

const MOBILE = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/products", label: "دسته‌بندی‌ها", icon: Grid3X3 },
  { href: "/products?sort=bestsellers", label: "پرفروش‌ها", icon: Tag },
  { href: "/products?discount=1", label: "تخفیف‌ها", icon: Tag },
  { href: "/about", label: "درباره ما", icon: Info },
  { href: "/contact", label: "تماس با ما", icon: Phone },
  { href: "/profile", label: "حساب کاربری", icon: User },
  { href: "/login", label: "ورود / ثبت‌نام", icon: LogIn },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { totalItems, isReady } = useCart();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
      setQuery("");
      setSearchOpen(false);
      setDrawerOpen(false);
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border pt-safe">
        <div className="mx-auto max-w-content px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-3 h-14 sm:h-[4.25rem]">
            <button
              type="button"
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted shrink-0"
              onClick={() => setDrawerOpen(true)}
              aria-label="باز کردن منو"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>

            <Link
              href="/"
              className="text-base sm:text-lg font-extrabold tracking-tight shrink-0 text-foreground"
            >
              Web<span className="text-primary">Speed</span>
            </Link>

            <form
              onSubmit={submitSearch}
              className="hidden sm:flex flex-1 max-w-2xl mx-2 lg:mx-6"
            >
              <div className="relative w-full">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی محصول، برند یا دسته‌بندی"
                  className="w-full h-11 rounded-xl bg-muted border border-transparent pr-4 pl-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-white focus:border-border focus:ring-2 focus:ring-primary/15 transition-all"
                />
                <button
                  type="submit"
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-hover"
                  aria-label="جستجو"
                >
                  <Search className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-0.5 mr-auto sm:mr-0 shrink-0">
              <button
                type="button"
                className="sm:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted"
                onClick={() => setSearchOpen(true)}
                aria-label="جستجو"
              >
                <Search className="h-5 w-5" strokeWidth={1.75} />
              </button>

              <Link
                href="/login"
                className="hidden md:flex h-10 px-2.5 items-center gap-1.5 rounded-lg text-[13px] text-foreground/80 hover:text-foreground hover:bg-muted"
              >
                <User className="h-5 w-5" strokeWidth={1.75} />
                <span className="hidden lg:inline">ورود</span>
              </Link>

              <Link
                href="/profile"
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted"
                aria-label="علاقه‌مندی"
              >
                <Heart className="h-5 w-5" strokeWidth={1.75} />
              </Link>

              <div className="relative">
                <button
                  type="button"
                  className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted"
                  onClick={() => setCartOpen((v) => !v)}
                  aria-label="سبد خرید"
                >
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
                  {isReady && totalItems > 0 && (
                    <span className="absolute top-1 left-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white leading-none num">
                      {totalItems > 9 ? "۹+" : formatNumber(totalItems)}
                    </span>
                  )}
                </button>
                <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block border-t border-border relative bg-white">
          <div className="mx-auto max-w-content px-6 flex items-center h-11 gap-0.5 text-[13px]">
            <button
              type="button"
              className="flex items-center gap-1.5 h-9 px-3 rounded-lg font-semibold text-foreground hover:bg-muted transition-colors"
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
            >
              <Grid3X3 className="h-4 w-4" />
              دسته‌بندی‌ها
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  megaOpen && "rotate-180"
                )}
              />
            </button>
            <span className="w-px h-4 bg-border mx-1" />
            {NAV.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className={cn(
                  "h-9 px-3 rounded-lg flex items-center font-medium transition-colors",
                  l.accent
                    ? "text-primary hover:bg-primary/5"
                    : "text-foreground/75 hover:text-foreground hover:bg-muted"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!drawerOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            drawerOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-[min(19rem,88vw)] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col pt-safe",
            drawerOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
            <Link href="/" onClick={() => setDrawerOpen(false)}>
              <span className="text-sm font-extrabold">
                Web<span className="text-primary">Speed</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted"
              aria-label="بستن"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={submitSearch} className="p-3 border-b border-border">
            <div className="relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو..."
                className="w-full h-10 rounded-xl bg-muted pr-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </form>

          <nav className="flex-1 overflow-y-auto py-2">
            {MOBILE.map(({ href, label, icon: Icon }) => (
              <Link
                key={href + label}
                href={href}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-[15px] font-medium hover:bg-muted"
              >
                <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Link
              href="/cart"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-white text-sm font-semibold"
            >
              <ShoppingBag className="h-4 w-4" />
              سبد خرید
              {isReady && totalItems > 0 && (
                <span className="num">({formatNumber(totalItems)})</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
