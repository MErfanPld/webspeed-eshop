"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { pageTitleFromPath } from "./nav-config";

export default function AdminTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const title = pageTitleFromPath(pathname || "/admin");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 h-[70px] shrink-0 bg-white border-b border-[#E5EAEF]">
        <div className="h-full px-4 sm:px-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl text-[#7C8FAC] hover:bg-[#F0F5F9]"
            aria-label="منو"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[15px] sm:text-base font-semibold text-[#2A3547] truncate">{title}</p>
            <p className="text-[11px] text-[#7C8FAC] mt-0.5 hidden sm:block">پنل مدیریت فروشگاه</p>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 h-10 min-w-[200px] px-3.5 rounded-xl border border-[#E5EAEF] bg-[#F0F5F9] text-xs text-[#7C8FAC] hover:border-[#5D87FF]/40 transition-colors"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-right">جستجو در پنل...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-[#E5EAEF] font-mono">⌘K</kbd>
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl text-[#7C8FAC] hover:bg-[#F0F5F9]"
            aria-label="جستجو"
          >
            <Search className="h-4 w-4" />
          </button>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex h-10 items-center gap-2 px-3.5 rounded-xl border border-[#E5EAEF] text-xs font-semibold text-[#2A3547] hover:bg-[#F0F5F9]"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#7C8FAC]" />
            فروشگاه
          </Link>

          <button
            type="button"
            className="relative h-10 w-10 inline-flex items-center justify-center rounded-xl text-[#7C8FAC] hover:bg-[#F0F5F9]"
            aria-label="اعلان‌ها"
          >
            <Bell className="h-4 w-4" strokeWidth={1.75} />
            <span className="absolute top-2.5 left-2.5 h-2 w-2 rounded-full bg-[#FA896B]" />
          </button>

          <Link
            href="/admin/login"
            className="h-10 w-10 rounded-xl bg-[#5D87FF] text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-md shadow-[#5D87FF]/25"
            title="حساب"
          >
            W
          </Link>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4">
          <div className="absolute inset-0 bg-[#2A3547]/40 backdrop-blur-[2px]" onClick={() => setSearchOpen(false)} />
          <div role="dialog" className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5EAEF] overflow-hidden" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
            <div className="flex items-center gap-3 px-4 h-14 border-b border-[#E5EAEF]">
              <Search className="h-4 w-4 text-[#7C8FAC] shrink-0" />
              <input autoFocus placeholder="جستجوی صفحات، محصولات، سفارش‌ها..." className="flex-1 bg-transparent text-sm outline-none text-[#2A3547] placeholder:text-[#7C8FAC]/70" />
              <kbd className="text-[10px] text-[#7C8FAC] border border-[#E5EAEF] px-1.5 py-0.5 rounded">ESC</kbd>
            </div>
            <div className="p-2 max-h-72 overflow-y-auto">
              {[
                { label: "داشبورد", href: "/admin" },
                { label: "محصولات", href: "/admin/products" },
                { label: "سفارش‌ها", href: "/admin/orders" },
                { label: "صفحات", href: "/admin/pages" },
                { label: "مشتری‌ها", href: "/admin/customers" },
                { label: "دسته‌بندی‌ها", href: "/admin/categories" },
              ].map((item) => (
                <Link key={item.href + item.label} href={item.href} onClick={() => setSearchOpen(false)} className="flex items-center px-3 h-11 rounded-xl text-sm font-medium text-[#2A3547] hover:bg-[#F0F5F9]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
