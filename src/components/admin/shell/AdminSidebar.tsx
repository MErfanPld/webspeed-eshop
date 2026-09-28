"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
    <div
      className="flex flex-col h-full text-[#A8B3CF]"
      style={{
        fontFamily: "Vazirmatn, Tahoma, sans-serif",
        background: "linear-gradient(180deg, #1B2A4A 0%, #253662 55%, #1E2F55 100%)",
      }}
    >
      <div
        className={cn(
          "h-[72px] shrink-0 flex items-center border-b border-white/[0.07]",
          collapsed ? "justify-center px-2" : "px-4 gap-2"
        )}
      >
        {!collapsed ? (
          <>
            <Link href="/admin" className="flex items-center gap-3 min-w-0 flex-1">
              <span className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-[#5D87FF] to-[#4570EA] text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-lg shadow-[#5D87FF]/40">
                W
                <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-[#13DEB9] border-2 border-[#1B2A4A]" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold text-white leading-tight truncate">WebSpeed</span>
                <span className="block text-[10px] text-white/40 font-medium mt-0.5">Admin Panel</span>
              </span>
            </Link>
            <button type="button" onClick={toggle} className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/35 hover:bg-white/10 hover:text-white" aria-label="جمع کردن منو">
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Link href="/admin" className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#5D87FF] to-[#4570EA] text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-[#5D87FF]/40">
              W
            </Link>
            <button type="button" onClick={toggle} className="hidden lg:inline-flex h-7 w-7 items-center justify-center rounded-lg text-white/35 hover:bg-white/10 hover:text-white" aria-label="باز کردن منو">
              <PanelLeftOpen className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {adminNav.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href, item.match, item.label);
                const Icon = item.icon;
                const rowClass = cn(
                  "group flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-150",
                  collapsed ? "justify-center h-11 w-11 mx-auto" : "px-3 h-11",
                  item.disabled && "opacity-30 cursor-not-allowed",
                  !item.disabled && active && "bg-gradient-to-l from-[#5D87FF] to-[#6E94FF] text-white shadow-lg shadow-[#5D87FF]/30",
                  !item.disabled && !active && "text-[#A8B3CF] hover:bg-white/[0.06] hover:text-white"
                );

                const content = (
                  <>
                    <span
                      className={cn(
                        "shrink-0 flex items-center justify-center rounded-lg transition-colors",
                        !collapsed && active && "bg-white/15 h-7 w-7",
                        !collapsed && !active && "h-7 w-7 bg-white/[0.04] group-hover:bg-white/[0.08]",
                        collapsed && "h-5 w-5"
                      )}
                    >
                      <Icon className="h-[16px] w-[16px]" strokeWidth={active ? 2 : 1.6} />
                    </span>
                    {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                    {!collapsed && item.disabled && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">به‌زودی</span>
                    )}
                    {!collapsed && active && !item.disabled && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80 shrink-0" />
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
                    <Link href={item.href} title={collapsed ? item.label : undefined} onClick={onMobileClose} className={rowClass}>
                      {content}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-3 border-t border-white/[0.07]">
          <div className="rounded-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/[0.06] px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="h-8 w-8 rounded-lg bg-[#5D87FF]/25 text-[#8BABFF] text-xs font-bold flex items-center justify-center">WS</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">WebSpeed</p>
                <p className="text-[10px] text-white/35">نسخه ۱.۰ · Admin</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside className={cn("hidden lg:flex flex-col shrink-0 h-screen sticky top-0 transition-[width] duration-200 overflow-hidden", collapsed ? "w-[76px]" : "w-[268px]")}>
        {NavBody}
      </aside>

      <div className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div className={cn("absolute inset-0 bg-black/50 transition-opacity", mobileOpen ? "opacity-100" : "opacity-0")} onClick={onMobileClose} />
        <aside className={cn("absolute top-0 right-0 h-full w-[min(268px,88vw)] shadow-2xl transition-transform duration-200 overflow-hidden", mobileOpen ? "translate-x-0" : "translate-x-full")}>
          {NavBody}
        </aside>
      </div>
    </>
  );
}
