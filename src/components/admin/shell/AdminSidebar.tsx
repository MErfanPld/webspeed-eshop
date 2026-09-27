"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { adminNav } from "./nav-config";

const COLLAPSE_KEY = "webspeed-admin-sidebar-collapsed";

export default function AdminSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {}
  }, []);

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  const isActive = (href: string, match?: string, label?: string) => {
    if (label === "صفحه‌ساز") return pathname.startsWith("/admin/builder");
    if (href === "/admin") return pathname === "/admin";
    if (match) return pathname.startsWith(match);
    if (href === "/") return false;
    return pathname.startsWith(href);
  };

  const NavBody = (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          "h-[var(--admin-topbar-h)] shrink-0 flex items-center border-b border-[var(--admin-border)]",
          collapsed ? "justify-center px-2" : "px-5 gap-2"
        )}
      >
        {!collapsed && (
          <Link href="/admin" className="text-[15px] font-semibold tracking-tight text-[var(--admin-text)]">
            WebSpeed
          </Link>
        )}
        {collapsed && (
          <Link
            href="/admin"
            className="h-8 w-8 rounded-lg bg-[var(--admin-text)] text-white text-xs font-bold flex items-center justify-center"
          >
            W
          </Link>
        )}
        <button
          type="button"
          onClick={toggle}
          className={cn(
            "hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--admin-text-secondary)] hover:bg-[var(--admin-muted)] hover:text-[var(--admin-text)] transition-colors",
            !collapsed && "mr-auto"
          )}
          aria-label={collapsed ? "باز کردن منو" : "جمع کردن منو"}
        >
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {adminNav.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[11px] font-medium text-[var(--admin-text-secondary)] tracking-wide">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.match, item.label);
                const Icon = item.icon;
                const content = (
                  <>
                    <Icon
                      className={cn("h-[18px] w-[18px] shrink-0", active && "text-[var(--admin-accent)]")}
                      strokeWidth={1.5}
                    />
                    {!collapsed && <span className="truncate leading-none">{item.label}</span>}
                    {!collapsed && item.disabled && (
                      <span className="mr-auto text-[10px] text-[var(--admin-text-secondary)] opacity-70">به‌زودی</span>
                    )}
                  </>
                );

                if (item.disabled) {
                  return (
                    <li key={item.href + item.label}>
                      <span
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-[var(--admin-radius-sm)] text-sm text-[var(--admin-text-secondary)]/60 cursor-not-allowed",
                          collapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 h-9"
                        )}
                      >
                        {content}
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2.5 rounded-[var(--admin-radius-sm)] text-sm font-medium transition-colors duration-150",
                        collapsed ? "justify-center h-10 w-10 mx-auto" : "px-3 h-9",
                        active
                          ? "bg-[var(--admin-accent-soft)] text-[var(--admin-text)]"
                          : "text-[var(--admin-text-secondary)] hover:bg-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                      )}
                    >
                      {content}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 border-l border-[var(--admin-border)] bg-[var(--admin-surface)] h-screen sticky top-0 transition-[width] duration-200 ease-out",
          collapsed ? "w-[var(--admin-sidebar-collapsed)]" : "w-[var(--admin-sidebar-w)]"
        )}
      >
        {NavBody}
      </aside>

      <div className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          className={cn(
            "absolute inset-0 bg-black/25 transition-opacity duration-200",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onMobileClose}
        />
        <aside
          className={cn(
            "absolute top-0 right-0 h-full w-[min(var(--admin-sidebar-w),85vw)] bg-[var(--admin-surface)] border-l border-[var(--admin-border)] shadow-[var(--admin-shadow-md)] transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {NavBody}
        </aside>
      </div>
    </>
  );
}
