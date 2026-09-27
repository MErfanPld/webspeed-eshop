"use client";

import { useState } from "react";
import Link from "next/link";
import {
  adminStats,
  revenueByDay,
  revenueByMonth,
  mockOrders,
  statusLabel,
} from "@/data/admin";
import { formatPrice, formatNumber } from "@/lib/utils";
import { products } from "@/data/products";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import {
  ArrowUpRight,
  Package,
  FileText,
  ShoppingBag,
  Users,
  Wallet,
  TrendingUp,
} from "lucide-react";

type Period = "week" | "month" | "year";

const kpiIconStyles = [
  "bg-[#5D87FF]/15 text-[#5D87FF]",
  "bg-[#13DEB9]/15 text-[#13DEB9]",
  "bg-[#FFAE1F]/15 text-[#FFAE1F]",
  "bg-[#FA896B]/15 text-[#FA896B]",
];

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<Period>("month");

  const revenue = adminStats.revenue[period];
  const orders = adminStats.orders[period];
  const customers = adminStats.customers[period];
  const chartData = period === "week" ? revenueByDay : revenueByMonth;
  const maxVal = Math.max(...chartData.map((d) => d.value), 1);
  const periodLabel =
    period === "week" ? "هفته" : period === "month" ? "ماه" : "سال";

  const kpis = [
    { label: `فروش ${periodLabel}`, value: formatPrice(revenue), delta: "+۱۲٪", icon: Wallet },
    { label: "سفارش‌ها", value: formatNumber(orders), delta: "+۸٪", icon: ShoppingBag },
    { label: "مشتری جدید", value: formatNumber(customers), delta: "+۵٪", icon: Users },
    { label: "محصولات", value: formatNumber(products.length), delta: null, icon: Package },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AdminPageHeader
        title="داشبورد"
        description="خلاصه وضعیت فروشگاه WebSpeed"
        actions={
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[var(--admin-border)] shadow-sm">
            {([["week", "هفته"], ["month", "ماه"], ["year", "سال"]] as const).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriod(key)}
                  className={`h-8 px-3.5 rounded-lg text-xs font-semibold transition-colors ${
                    period === key
                      ? "bg-[var(--admin-accent)] text-white"
                      : "text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)]"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <AdminCard key={kpi.label} className="!p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-[var(--admin-text-secondary)] font-medium">{kpi.label}</p>
                <p className="text-xl font-semibold mt-2 tracking-tight tabular-nums text-[var(--admin-text)]">
                  {kpi.value}
                </p>
                {kpi.delta && (
                  <p className="text-xs font-semibold text-[#13DEB9] mt-2 inline-flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {kpi.delta}
                  </p>
                )}
              </div>
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${kpiIconStyles[i]}`}>
                <kpi.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <AdminCard className="lg:col-span-3 !p-5 sm:!p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-base font-semibold text-[var(--admin-text)]">نمای فروش</p>
            <span className="text-xs text-[var(--admin-text-secondary)]">{periodLabel} جاری</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div
                  className="w-full rounded-t-lg bg-[var(--admin-accent)]/90"
                  style={{ height: `${Math.max(8, (d.value / maxVal) * 100)}%`, minHeight: 4 }}
                />
                <span className="text-[10px] text-[var(--admin-text-secondary)] truncate w-full text-center">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="lg:col-span-2 !p-5 sm:!p-6">
          <p className="text-base font-semibold mb-4">دسترسی سریع</p>
          <div className="space-y-2">
            {[
              { href: "/admin/products", label: "محصولات", icon: Package, color: "bg-[#5D87FF]/15 text-[#5D87FF]" },
              { href: "/admin/pages", label: "صفحه‌ساز", icon: FileText, color: "bg-[#13DEB9]/15 text-[#13DEB9]" },
              { href: "/admin/orders", label: "سفارش‌ها", icon: ArrowUpRight, color: "bg-[#FFAE1F]/15 text-[#FFAE1F]" },
            ].map((a) => (
              <Link
                key={a.href + a.label}
                href={a.href}
                className="flex items-center gap-3 h-12 px-3 rounded-xl border border-[var(--admin-border)] hover:bg-[var(--admin-muted)] transition-colors text-sm font-medium"
              >
                <span className={`h-9 w-9 rounded-xl inline-flex items-center justify-center ${a.color}`}>
                  <a.icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                {a.label}
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>

      <AdminCard padding={false}>
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--admin-border)]">
          <p className="text-base font-semibold">سفارش‌های اخیر</p>
          <Link href="/admin/orders">
            <AdminButton variant="ghost" size="sm">مشاهده همه</AdminButton>
          </Link>
        </div>
        <div className="divide-y divide-[var(--admin-border)]">
          {mockOrders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-3 px-5 sm:px-6 py-3.5 hover:bg-[var(--admin-muted)]/60 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{order.customer}</p>
                <p className="text-xs text-[var(--admin-text-secondary)] mt-0.5 tabular-nums">{order.id}</p>
              </div>
              <AdminBadge
                tone={
                  order.status === "delivered"
                    ? "success"
                    : order.status === "cancelled"
                      ? "danger"
                      : "default"
                }
              >
                {statusLabel[order.status] || order.status}
              </AdminBadge>
              <p className="text-sm font-semibold tabular-nums shrink-0 hidden sm:block">
                {formatPrice(order.total)}
              </p>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
