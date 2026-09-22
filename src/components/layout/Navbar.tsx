"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  User,
  ChevronDown,
  Home,
  Shirt,
  Info,
  Phone,
  LogIn,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn, formatNumber } from "@/lib/utils";
import SearchOverlay from "@/components/navigation/SearchOverlay";
import MegaMenu from "@/components/layout/MegaMenu";
import CartDropdown from "@/components/layout/CartDropdown";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { totalItems, isReady } = useCart();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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

  const mobileLinks = [
    { href: "/", label: "خانه", icon: Home },
    { href: "/products?gender=men", label: "مردانه", icon: Shirt },
    { href: "/products?gender=women", label: "زنانه", icon: Shirt },
    { href: "/products", label: "همه محصولات", icon: Shirt },
    { href: "/about", label: "درباره ما", icon: Info },
    { href: "/contact", label: "تماس با ما", icon: Phone },
    { href: "/profile", label: "حساب کاربری", icon: User },
    { href: "/login", label: "ورود / ثبت‌نام", icon: LogIn },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border pt-safe">
        <div className="mx-auto max-w-content px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-3 h-14 sm:h-16">
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
              className="text-[15px] sm:text-base font-bold tracking-[0.14em] uppercase shrink-0 text-foreground"
            >
              WebSpeed
            </Link>

            <form
              onSubmit={submitSearch}
              className="hidden sm:flex flex-1 max-w-xl mx-2 lg:mx-6"
            >
              <div className="relative w-full">
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در محصولات..."
                  className="w-full h-11 rounded-xl bg-muted/80 border border-transparent pr-4 pl-11 text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-white focus:border-border focus:ring-2 focus:ring-foreground/5 transition-all"
                />
                <button
                  type="submit"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                  aria-label="جستجو"
                >
                  <Search className="h-4 w-4" strokeWidth={1.75} />
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
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted"
                aria-label="ورود"
              >
                <User className="h-5 w-5" strokeWidth={1.75} />
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
                    <span className="absolute top-1 left-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--discount)] px-1 text-[10px] font-bold text-white leading-none num">
                      {totalItems > 9 ? "۹+" : formatNumber(totalItems)}
                    </span>
                  )}
                </button>
                <CartDropdown open={cartOpen} onClose={() => setCartOpen(false)} />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block border-t border-border/70 relative bg-white">
          <div className="mx-auto max-w-content px-6 flex items-center h-11 gap-1 text-[13px]">
            <button
              type="button"
              className="flex items-center gap-1.5 h-9 px-3 rounded-lg font-semibold text-foreground hover:bg-muted transition-colors"
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
            >
              دسته‌بندی کالاها
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  megaOpen && "rotate-180"
                )}
              />
            </button>
            <span className="w-px h-4 bg-border mx-1" />
            <Link href="/" className="h-9 px-3 rounded-lg flex items-center text-foreground/75 hover:text-foreground hover:bg-muted transition-colors">خانه</Link>
            <Link href="/products?gender=men" className="h-9 px-3 rounded-lg flex items-center text-foreground/75 hover:text-foreground hover:bg-muted transition-colors">مردانه</Link>
            <Link href="/products?gender=women" className="h-9 px-3 rounded-lg flex items-center text-foreground/75 hover:text-foreground hover:bg-muted transition-colors">زنانه</Link>
            <Link href="/products?sort=newest" className="h-9 px-3 rounded-lg flex items-center text-foreground/75 hover:text-foreground hover:bg-muted transition-colors">جدیدترین</Link>
            <Link href="/about" className="h-9 px-3 rounded-lg flex items-center text-foreground/75 hover:text-foreground hover:bg-muted transition-colors">درباره ما</Link>
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
            <Link href="/" onClick={() => setDrawerOpen(false)} className="flex flex-col">
              <span className="text-sm font-bold tracking-[0.16em] uppercase leading-none">WebSpeed</span>
              <span className="text-[10px] text-muted-foreground mt-1">فروشگاه پوشاک</span>
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-muted"
              aria-label="بستن"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <form onSubmit={submitSearch} className="p-3 border-b border-border shrink-0">
            <div className="relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو..."
                className="w-full h-10 rounded-xl bg-muted pr-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </form>

          <nav className="flex-1 overflow-y-auto py-2">
            {mobileLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href + label}
                href={href}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-5 py-3.5 text-[15px] font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border shrink-0">
            <Link
              href="/cart"
              onClick={() => setDrawerOpen(false)}
              className="flex items-center justify-center gap-2 h-11 rounded-xl bg-foreground text-white text-sm font-semibold"
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
