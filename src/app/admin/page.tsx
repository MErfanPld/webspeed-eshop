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
import {
  ArrowUpRight,
  Package,
  FileText,
  ShoppingBag,
  Users,
  Wallet,
  TrendingUp,
  Sparkles,
} from "lucide-react";

type Period = "week" | "month" | "year";

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<Period>("month");

  const revenue = adminStats.revenue[period];
  const ordersCount = adminStats.orders[period];
  const customers = adminStats.customers[period];
  const chartData = period === "week" ? revenueByDay : revenueByMonth;
  const maxVal = Math.max(...chartData.map((d) => d.value), 1);
  const periodLabel =
    period === "week" ? "هفته" : period === "month" ? "ماه" : "سال";

  const cards = [
    {
      label: `فروش ${periodLabel}`,
      value: formatPrice(revenue),
      delta: "+۱۲٪",
      icon: Wallet,
      iconBg: "bg-[#ECF2FF]",
      iconColor: "text-[#5D87FF]",
    },
    {
      label: "سفارش‌ها",
      value: formatNumber(ordersCount),
      delta: "+۸٪",
      icon: ShoppingBag,
      iconBg: "bg-[#E6FFFA]",
      iconColor: "text-[#13DEB9]",
    },
    {
      label: "مشتری جدید",
      value: formatNumber(customers),
      delta: "+۵٪",
      icon: Users,
      iconBg: "bg-[#FEF5E5]",
      iconColor: "text-[#FFAE1F]",
    },
    {
      label: "محصولات",
      value: formatNumber(products.length),
      delta: null,
      icon: Package,
      iconBg: "bg-[#FDEDE8]",
      iconColor: "text-[#FA896B]",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#5D87FF] to-[#4570EA] text-white p-6 sm:p-8 shadow-[0_8px_24px_rgba(93,135,255,0.25)]">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-white/80 text-xs font-medium mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              پنل مدیریت WebSpeed
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">خوش آمدید 👋</h1>
            <p className="text-white/75 text-sm mt-2 max-w-md leading-relaxed">
              خلاصه فروش، سفارش‌ها و وضعیت فروشگاه در یک نگاه.
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/15 backdrop-blur-sm shrink-0">
            {([["week", "هفته"], ["month", "ماه"], ["year", "سال"]] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key)}
                className={`h-9 px-4 rounded-lg text-xs font-semibold transition-colors ${
                  period === key ? "bg-white text-[#5D87FF]" : "text-white/80 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute left-20 -top-8 h-24 w-24 rounded-full bg-white/10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-2xl border border-[#E5EAEF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#7C8FAC]">{c.label}</p>
                <p className="text-[22px] font-semibold text-[#2A3547] mt-2 tabular-nums tracking-tight">
                  {c.value}
                </p>
                {c.delta && (
                  <p className="mt-2 text-xs font-semibold text-[#13DEB9] inline-flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {c.delta} نسبت به قبل
                  </p>
                )}
              </div>
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
                <c.icon className={`h-5 w-5 ${c.iconColor}`} strokeWidth={1.75} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5EAEF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-base font-semibold text-[#2A3547]">نمای فروش</p>
              <p className="text-xs text-[#7C8FAC] mt-0.5">{periodLabel} جاری</p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-44">
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div
                  className="w-full rounded-t-lg bg-[#5D87FF]"
                  style={{
                    height: `${Math.max(10, (d.value / maxVal) * 100)}%`,
                    minHeight: 6,
                    opacity: 0.85 + (d.value / maxVal) * 0.15,
                  }}
                />
                <span className="text-[10px] text-[#7C8FAC] truncate w-full text-center">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5EAEF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 sm:p-6">
          <p className="text-base font-semibold text-[#2A3547] mb-4">دسترسی سریع</p>
          <div className="space-y-2.5">
            {[
              { href: "/admin/products", label: "مدیریت محصولات", icon: Package, bg: "bg-[#ECF2FF]", color: "text-[#5D87FF]" },
              { href: "/admin/pages", label: "صفحه‌ساز", icon: FileText, bg: "bg-[#E6FFFA]", color: "text-[#13DEB9]" },
              { href: "/admin/orders", label: "سفارش‌ها", icon: ArrowUpRight, bg: "bg-[#FEF5E5]", color: "text-[#FFAE1F]" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 h-12 px-3 rounded-xl border border-[#E5EAEF] hover:border-[#5D87FF]/30 hover:bg-[#F8FAFC] transition-colors"
              >
                <span className={`h-9 w-9 rounded-xl inline-flex items-center justify-center ${a.bg}`}>
                  <a.icon className={`h-4 w-4 ${a.color}`} strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-[#2A3547]">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5EAEF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E5EAEF]">
          <p className="text-base font-semibold text-[#2A3547]">سفارش‌های اخیر</p>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#5D87FF] hover:underline">
            مشاهده همه
          </Link>
        </div>
        <div className="divide-y divide-[#E5EAEF]">
          {mockOrders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center gap-3 px-5 sm:px-6 py-3.5 hover:bg-[#F8FAFC] transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#2A3547] truncate">{order.customer}</p>
                <p className="text-xs text-[#7C8FAC] mt-0.5 tabular-nums">{order.id}</p>
              </div>
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  order.status === "delivered"
                    ? "bg-[#E6FFFA] text-[#13DEB9]"
                    : order.status === "cancelled"
                      ? "bg-[#FDEDE8] text-[#FA896B]"
                      : "bg-[#ECF2FF] text-[#5D87FF]"
                }`}
              >
                {statusLabel[order.status] || order.status}
              </span>
              <p className="text-sm font-semibold text-[#2A3547] tabular-nums shrink-0 hidden sm:block">
                {formatPrice(order.total)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
