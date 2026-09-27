"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, ExternalLink, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { pageTitleFromPath } from "./nav-config";
import AdminButton from "@/components/admin/ui/AdminButton";

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
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const crumbs = [
    { label: "مدیریت", href: "/admin" },
    ...(pathname !== "/admin" ? [{ label: title, href: pathname }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-30 h-[var(--admin-topbar-h)] shrink-0 border-b border-[var(--admin-border)] bg-[var(--admin-surface)]/90 backdrop-blur-md">
        <div className="h-full px-3 sm:px-5 flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-[var(--admin-radius-sm)] text-[var(--admin-text-secondary)] hover:bg-[var(--admin-muted)]"
            aria-label="منو"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <div className="min-w-0 flex-1">
            <nav className="hidden sm:flex items-center gap-1 text-xs text-[var(--admin-text-secondary)] mb-0.5">
              {crumbs.map((c, i) => (
                <span key={c.href} className="inline-flex items-center gap-1">
                  {i > 0 && <ChevronLeft className="h-3 w-3 opacity-50" />}
                  <Link
                    href={c.href}
                    className={cn(
                      "hover:text-[var(--admin-text)] transition-colors",
                      i === crumbs.length - 1 && "text-[var(--admin-text)] font-medium"
                    )}
                  >
                    {c.label}
                  </Link>
                </span>
              ))}
            </nav>
            <h1 className="text-sm sm:text-[15px] font-semibold text-[var(--admin-text)] truncate leading-tight">
              {title}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 h-9 min-w-[180px] px-3 rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-bg)] text-xs text-[var(--admin-text-secondary)] hover:border-[var(--admin-text)]/20"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-right">جستجو...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--admin-muted)] font-mono">⌘K</kbd>
          </button>

          <AdminButton variant="icon" className="md:hidden" onClick={() => setSearchOpen(true)} aria-label="جستجو">
            <Search className="h-4 w-4" />
          </AdminButton>

          <Link href="/" target="_blank" className="hidden sm:inline-flex">
            <AdminButton variant="secondary" size="sm">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>فروشگاه</span>
            </AdminButton>
          </Link>

          <AdminButton variant="icon" aria-label="اعلان‌ها">
            <Bell className="h-4 w-4" strokeWidth={1.5} />
          </AdminButton>

          <Link
            href="/admin/login"
            className="h-8 w-8 rounded-full bg-[var(--admin-text)] text-white text-xs font-semibold flex items-center justify-center shrink-0"
            title="حساب"
          >
            W
          </Link>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setSearchOpen(false)} />
          <div role="dialog" aria-label="جستجوی مدیریت" className="relative w-full max-w-lg bg-[var(--admin-surface)] rounded-[var(--admin-radius-lg)] shadow-[var(--admin-shadow-md)] border border-[var(--admin-border)] overflow-hidden">
            <div className="flex items-center gap-2 px-4 h-12 border-b border-[var(--admin-border)]">
              <Search className="h-4 w-4 text-[var(--admin-text-secondary)] shrink-0" />
              <input autoFocus placeholder="جستجوی صفحات، محصولات، تنظیمات..." className="flex-1 bg-transparent text-sm outline-none" />
              <kbd className="text-[10px] text-[var(--admin-text-secondary)]">ESC</kbd>
            </div>
            <div className="p-2 max-h-72 overflow-y-auto">
              {[
                { label: "داشبورد", href: "/admin" },
                { label: "محصولات", href: "/admin/products" },
                { label: "سفارش‌ها", href: "/admin/orders" },
                { label: "صفحات", href: "/admin/pages" },
                { label: "مشتری‌ها", href: "/admin/customers" },
              ].map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center px-3 h-10 rounded-[var(--admin-radius-sm)] text-sm hover:bg-[var(--admin-muted)]"
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
