"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn, formatNumber } from "@/lib/utils";
import SearchOverlay from "@/components/navigation/SearchOverlay";

const navLinks = [
  { href: "/products?sort=newest", label: "جدید" },
  { href: "/products?gender=men", label: "مردانه" },
  { href: "/products?gender=women", label: "زنانه" },
  { href: "/products", label: "همه" },
  { href: "/about", label: "درباره" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm pt-safe">
        <div className="mx-auto flex h-14 sm:h-[3.75rem] max-w-content items-center justify-between px-4 xs:px-5 sm:px-6 lg:px-8">
          <button
            type="button"
            className="lg:hidden flex h-11 w-11 items-center justify-center -mr-2"
            onClick={() => setOpen(true)}
            aria-label="باز کردن منو"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 text-[15px] sm:text-base font-bold tracking-[0.2em] uppercase"
          >
            WebSpeed
          </Link>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="hidden sm:flex h-11 w-11 items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
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
                <span className="absolute top-1.5 left-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground leading-none num">
                  {totalItems > 9 ? "۹+" : formatNumber(totalItems)}
                </span>
              )}
            </Link>
          </div>
        </div>
        <hr className="rule" />

        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            open ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-foreground/25 transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0"
            )}
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute top-0 right-0 h-full w-[min(20rem,88vw)] bg-background transition-transform duration-300 ease-out pt-safe",
              open ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex items-center justify-between h-14 px-5">
              <span className="type-label text-muted-foreground">منو</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center -ml-2"
                aria-label="بستن منو"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <hr className="rule" />
            <nav className="flex flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-6 py-3.5 text-base font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="rule my-3" />
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="px-6 py-3.5 text-base font-medium"
              >
                تماس
              </Link>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="px-6 py-3.5 text-base font-medium"
              >
                حساب کاربری
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSearchOpen(true);
                }}
                className="px-6 py-3.5 text-base font-medium text-right"
              >
                جستجو
              </button>
            </nav>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
