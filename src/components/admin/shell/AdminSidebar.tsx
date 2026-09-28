"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
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
    if (label === "\u0635\u0641\u062d\u0647\u200c\u0633\u0627\u0632") return pathname.startsWith("/admin/builder");
    if (href === "/admin") return pathname === "/admin";
    if (match) return pathname.startsWith(match);
    if (href === "/") return false;
    return pathname.startsWith(href);
  };

  const NavBody = (
    <div className="flex flex-col h-full bg-white text-[#111]">
      <div
        className={cn(
          "h-14 shrink-0 flex items-center border-b border-[#E8E8E8]",
          collapsed ? "justify-center px-2" : "px-4 gap-2.5"
        )}
      >
        <div className="h-8 w-8 rounded-lg bg-[#111] text-white text-xs font-bold flex items-center justify-center shrink-0">
          W
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold tracking-tight truncate">WebSpeed</p>
            <p className="text-[10px] text-[#737373] truncate">\u067e\u0646\u0644 \u0645\u062f\u06cc\u0631\u06cc\u062a</p>
          </div>
        )}
        <button
          type="button"
          onClick={toggle}
          className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#737373] hover:bg-[#F7F7F7] hover:text-[#111]"
          aria-label={collapsed ? "expand" : "collapse"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={onMobileClose}
          className="lg:hidden h-8 w-8 inline-flex items-center justify-center rounded-lg text-[#737373] hover:bg-[#F7F7F7]"
          aria-label="close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {adminNav.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#A3A3A3]">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href, item.match, item.label);
                const Icon = item.icon;
                if (item.disabled) {
                  return (
                    <li key={item.href + item.label}>
                      <span
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl text-[13px] font-medium text-[#A3A3A3] cursor-not-allowed",
                          collapsed ? "justify-center h-10 w-10 mx-auto" : "px-2.5 h-10"
                        )}
                        title={item.label}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-50" strokeWidth={1.75} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      title={item.label}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl text-[13px] font-medium transition-colors",
                        collapsed ? "justify-center h-10 w-10 mx-auto" : "px-2.5 h-10",
                        active
                          ? "bg-[#111] text-white"
                          : "text-[#525252] hover:bg-[#F7F7F7] hover:text-[#111]"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="shrink-0 p-3 border-t border-[#E8E8E8]">
          <p className="text-[10px] text-[#A3A3A3] text-center">WebSpeed Admin</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 border-l border-[#E8E8E8] bg-white sticky top-0 h-screen z-30 transition-[width] duration-200",
          collapsed ? "w-[72px]" : "w-[240px]"
        )}
      >
        {NavBody}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={onMobileClose} />
          <aside className="absolute top-0 bottom-0 right-0 w-[min(280px,88vw)] bg-white shadow-xl border-l border-[#E8E8E8]">
            {NavBody}
          </aside>
        </div>
      )}
    </>
  );
}
