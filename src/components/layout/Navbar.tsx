"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import SearchOverlay from "@/components/navigation/SearchOverlay";

const navLinks = [
  { href: "/products", label: "فروشگاه" },
  { href: "/products?gender=men", label: "مردانه" },
  { href: "/products?gender=women", label: "زنانه" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-sm pt-safe">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="lg:hidden flex h-11 w-11 items-center justify-center -mr-2 text-foreground"
            onClick={() => setOpen(true)}
            aria-label="باز کردن منو"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <Link
            href="/"
            className="text-lg sm:text-xl font-semibold tracking-[0.08em] text-foreground"
          >
            WEBSPEED
          </Link>

          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="جستجو"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <Link
              href="/profile"
              className="hidden sm:flex h-11 w-11 items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
              aria-label="حساب کاربری"
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-1.5 left-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background leading-none">
                  {totalItems > 9 ? "۹+" : formatNumber(totalItems)}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-background shadow-xl transition-transform duration-300 ease-out pt-safe",
              open ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex items-center justify-between h-14 px-4 border-b border-border">
              <span className="font-semibold tracking-wide">منو</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center -ml-2"
                aria-label="بستن منو"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-5 py-3.5 text-[15px] font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
