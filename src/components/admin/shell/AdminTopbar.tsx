"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, Bell, ExternalLink } from "lucide-react";
import { pageTitleFromPath } from "./nav-config";

export default function AdminTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname() || "/admin";
  const title = pageTitleFromPath(pathname);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 h-14 shrink-0 bg-white/90 backdrop-blur border-b border-[#E8E8E8] flex items-center gap-3 px-3 sm:px-5">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-lg text-[#525252] hover:bg-[#F7F7F7]"
          aria-label="منو"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#111] truncate">{title}</p>
          <p className="text-[10px] text-[#A3A3A3] truncate hidden sm:block">مدیریت فروشگاه</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="h-9 w-9 sm:w-auto sm:px-3 inline-flex items-center justify-center gap-2 rounded-lg border border-[#E8E8E8] text-[#525252] hover:bg-[#F7F7F7] text-xs font-medium"
            aria-label="جستجو"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">جستجو</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="h-9 w-9 sm:w-auto sm:px-3 inline-flex items-center justify-center gap-1.5 rounded-lg text-[#525252] hover:bg-[#F7F7F7] text-xs font-medium"
            title="مشاهده فروشگاه"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden md:inline">فروشگاه</span>
          </Link>

          <button
            type="button"
            className="relative h-9 w-9 inline-flex items-center justify-center rounded-lg text-[#525252] hover:bg-[#F7F7F7]"
            aria-label="اعلان‌ها"
          >
            <Bell className="h-4 w-4" />
          </button>

          <Link
            href="/admin/login"
            className="h-8 w-8 rounded-full bg-[#111] text-white text-xs font-bold flex items-center justify-center shrink-0"
            title="حساب"
          >
            W
          </Link>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4">
          <div className="absolute inset-0 bg-black/25" onClick={() => setSearchOpen(false)} />
          <div
            role="dialog"
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#E8E8E8] overflow-hidden"
            style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}
          >
            <div className="flex items-center gap-3 px-4 h-12 border-b border-[#E8E8E8]">
              <Search className="h-4 w-4 text-[#A3A3A3] shrink-0" />
              <input
                autoFocus
                placeholder="جستجوی صفحات، محصولات، سفارش‌ها..."
                className="flex-1 bg-transparent text-sm outline-none text-[#111] placeholder:text-[#A3A3A3]"
              />
              <kbd className="text-[10px] text-[#A3A3A3] border border-[#E8E8E8] px-1.5 py-0.5 rounded">ESC</kbd>
            </div>
            <div className="p-2 max-h-72 overflow-y-auto">
              {[
                { label: "داشبورد", href: "/admin" },
                { label: "محصولات", href: "/admin/products" },
                { label: "سفارش‌ها", href: "/admin/orders" },
                { label: "صفحات", href: "/admin/pages" },
                { label: "تم و ظاهر", href: "/admin/theme" },
                { label: "مشتری‌ها", href: "/admin/customers" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center px-3 h-10 rounded-xl text-sm font-medium text-[#111] hover:bg-[#F7F7F7]"
                >
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
