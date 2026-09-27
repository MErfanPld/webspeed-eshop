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
    <div className="flex flex-col h-full bg-[#253662] text-[#BDC6D9]">
      <div
        className={cn(
          "h-[70px] shrink-0 flex items-center border-b border-white/10",
          collapsed ? "justify-center px-2" : "px-5 gap-2"
        )}
      >
        {!collapsed && (
          <Link href="/admin" className="text-[17px] font-bold tracking-tight text-white">
            WebSpeed
          </Link>
        )}
        {collapsed && (
          <Link
            href="/admin"
            className="h-10 w-10 rounded-xl bg-[#5D87FF] text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-[#5D87FF]/30"
          >
            W
          </Link>
        )}
        <button
          type="button"
          onClick={toggle}
          className={cn(
            "hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white",
            !collapsed && "mr-auto"
          )}
          aria-label={collapsed ? "باز کردن منو" : "جمع کردن منو"}
        >
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
        {adminNav.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-white/30">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href, item.match, item.label);
                const Icon = item.icon;
                const rowClass = cn(
                  "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150",
                  collapsed ? "justify-center h-11 w-11 mx-auto" : "px-3 h-11",
                  item.disabled && "opacity-35 cursor-not-allowed",
                  !item.disabled && active && "bg-[#5D87FF] text-white shadow-md shadow-[#5D87FF]/25",
                  !item.disabled && !active && "text-[#BDC6D9] hover:bg-white/8 hover:text-white"
                );

                const content = (
                  <>
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.disabled && (
                      <span className="mr-auto text-[10px] opacity-60">به‌زودی</span>
                    )}
                  </>
                );

                if (item.disabled) {
                  return (
                    <li key={item.href + item.label}>
                      <span title={collapsed ? item.label : undefined} className={rowClass}>
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
                      className={rowClass}
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
          "hidden lg:flex flex-col shrink-0 h-screen sticky top-0 transition-[width] duration-200 overflow-hidden",
          collapsed ? "w-20" : "w-[270px]"
        )}
      >
        {NavBody}
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/45 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onMobileClose}
        />
        <aside
          className={cn(
            "absolute top-0 right-0 h-full w-[min(270px,88vw)] shadow-2xl transition-transform duration-200 overflow-hidden",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {NavBody}
        </aside>
      </div>
    </>
  );
}
