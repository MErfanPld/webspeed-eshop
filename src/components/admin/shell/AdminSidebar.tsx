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
      dir="rtl"
      className="flex flex-col h-full"
      style={{
        fontFamily: "Vazirmatn, Tahoma, system-ui, sans-serif",
        background: "linear-gradient(185deg, #152238 0%, #1e3154 40%, #243a62 100%)",
        color: "#A8B3CF",
      }}
    >
      <div
        className={cn(
          "h-[72px] shrink-0 flex items-center",
          collapsed ? "justify-center px-2" : "px-4 gap-2"
        )}
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        {!collapsed ? (
          <>
            <Link href="/admin" className="flex items-center gap-3 min-w-0 flex-1 no-underline">
              <span
                className="relative h-10 w-10 rounded-2xl text-white text-sm font-bold flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #5D87FF 0%, #3D6FE8 100%)",
                  boxShadow: "0 8px 20px rgba(93,135,255,0.4)",
                }}
              >
                W
                <span
                  className="absolute h-2.5 w-2.5 rounded-full"
                  style={{
                    bottom: -2,
                    left: -2,
                    background: "#13DEB9",
                    border: "2px solid #152238",
                  }}
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold text-white leading-tight truncate">
                  WebSpeed
                </span>
                <span
                  className="block text-[10px] font-medium mt-0.5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  پنل مدیریت
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={toggle}
              className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ color: "rgba(255,255,255,0.35)" }}
              aria-label="جمع کردن منو"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <Link
              href="/admin"
              className="h-10 w-10 rounded-2xl text-white text-sm font-bold flex items-center justify-center no-underline"
              style={{
                background: "linear-gradient(135deg, #5D87FF 0%, #3D6FE8 100%)",
                boxShadow: "0 8px 20px rgba(93,135,255,0.4)",
              }}
            >
              W
            </Link>
            <button
              type="button"
              onClick={toggle}
              className="hidden lg:inline-flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ color: "rgba(255,255,255,0.35)" }}
              aria-label="باز کردن منو"
            >
              <PanelLeftOpen className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {adminNav.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p
                className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                {section.title}
              </p>
            )}
            <ul className="space-y-1 list-none m-0 p-0">
              {section.items.map((item) => {
                const active = isActive(item.href, item.match, item.label);
                const Icon = item.icon;

                const baseStyle: React.CSSProperties = {
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  ...(collapsed
                    ? { justifyContent: "center", height: 44, width: 44, margin: "0 auto" }
                    : { padding: "0 12px", height: 44 }),
                };

                if (item.disabled) {
                  return (
                    <li key={item.href + item.label}>
                      <span
                        title={collapsed ? item.label : undefined}
                        style={{
                          ...baseStyle,
                          opacity: 0.3,
                          cursor: "not-allowed",
                          color: "#A8B3CF",
                        }}
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.6} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                        {!collapsed && (
                          <span
                            className="mr-auto text-[9px] px-1.5 py-0.5 rounded"
                            style={{
                              background: "rgba(255,255,255,0.08)",
                              color: "rgba(255,255,255,0.45)",
                            }}
                          >
                            به‌زودی
                          </span>
                        )}
                      </span>
                    </li>
                  );
                }

                if (active) {
                  return (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        onClick={onMobileClose}
                        style={{
                          ...baseStyle,
                          background: "linear-gradient(90deg, #5D87FF 0%, #6E94FF 100%)",
                          color: "#ffffff",
                          boxShadow: "0 6px 18px rgba(93,135,255,0.35)",
                        }}
                      >
                        <span
                          className="shrink-0 flex items-center justify-center rounded-lg"
                          style={{
                            height: collapsed ? 20 : 28,
                            width: collapsed ? 20 : 28,
                            background: collapsed ? "transparent" : "rgba(255,255,255,0.18)",
                          }}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2} />
                        </span>
                        {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                        {!collapsed && (
                          <span
                            className="shrink-0 rounded-full"
                            style={{ height: 6, width: 6, background: "rgba(255,255,255,0.85)" }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      onClick={onMobileClose}
                      style={{
                        ...baseStyle,
                        color: "#A8B3CF",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#A8B3CF";
                      }}
                    >
                      <span
                        className="shrink-0 flex items-center justify-center rounded-lg"
                        style={{
                          height: collapsed ? 20 : 28,
                          width: collapsed ? 20 : 28,
                          background: collapsed ? "transparent" : "rgba(255,255,255,0.05)",
                        }}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.6} />
                      </span>
                      {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div
            className="rounded-xl px-3.5 py-3 flex items-center gap-2.5"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              className="h-8 w-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0"
              style={{ background: "rgba(93,135,255,0.25)", color: "#8BABFF" }}
            >
              WS
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate m-0">WebSpeed</p>
              <p className="text-[10px] m-0 mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                نسخه ۱.۰ · Admin
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside
        className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 transition-[width] duration-200 overflow-hidden"
        style={{ width: collapsed ? 76 : 268 }}
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
          className="absolute inset-0 transition-opacity"
          style={{
            background: "rgba(0,0,0,0.5)",
            opacity: mobileOpen ? 1 : 0,
          }}
          onClick={onMobileClose}
        />
        <aside
          className="absolute top-0 right-0 h-full shadow-2xl transition-transform duration-200 overflow-hidden"
          style={{
            width: "min(268px, 88vw)",
            transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          {NavBody}
        </aside>
      </div>
    </>
  );
}
