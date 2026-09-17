"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn, formatNumber } from "@/lib/utils";
import SearchOverlay from "@/components/navigation/SearchOverlay";

const navLinks = [
  { href: "/products", label: "فروشگاه" },
  { href: "/products?gender=men", label: "مردانه" },
  { href: "/products?gender=women", label: "زنانه" },
  { href: "/about", label: "درباره" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md pt-safe">
        <div className="mx-auto flex h-14 sm:h-16 max-w-content items-center justify-between px-4 xs:px-5 sm:px-6 lg:px-10">
          <button
            type="button"
            className="lg:hidden flex h-11 w-11 items-center justify-center -mr-2"
            onClick={() => setOpen(true)}
            aria-label="باز کردن منو"
          >
            <Menu className="h-5 w-5" strokeWidth={1.25} />
          </button>

          <Link
            href="/"
            className="text-[15px] sm:text-base font-medium tracking-[0.18em] uppercase"
          >
            WebSpeed
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="type-caption text-foreground/70 hover:text-foreground transition-colors duration-200"
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
              <Search className="h-5 w-5" strokeWidth={1.25} />
            </button>
            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
              {totalItems > 0 && (
                <span className="absolute top-1.5 left-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background leading-none num">
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
              "absolute inset-0 bg-foreground/20 transition-opacity duration-300",
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
                <X className="h-5 w-5" strokeWidth={1.25} />
              </button>
            </div>
            <hr className="rule" />
            <nav className="flex flex-col py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-6 py-4 type-title font-normal text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="px-6 py-4 type-title font-normal text-foreground"
              >
                تماس
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
