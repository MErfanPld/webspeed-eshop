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
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="lg:hidden p-2 -mr-2 text-foreground"
            onClick={() => setOpen(true)}
            aria-label="باز کردن منو"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            WEBSPEED
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="جستجو"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/profile"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="حساب کاربری"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                  {totalItems > 9 ? "۹+" : formatNumber(totalItems)}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
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
              "absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-background shadow-xl transition-transform duration-300 ease-out",
              open ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-lg">منو</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -ml-2"
                aria-label="بستن منو"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-base font-medium text-foreground hover:bg-muted rounded-sm"
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
