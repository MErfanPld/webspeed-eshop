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
import { categories } from "@/data/categories";

type Period = "week" | "month" | "year";

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<Period>("month");

  const revenue = adminStats.revenue[period];
  const orders = adminStats.orders[period];
  const customers = adminStats.customers[period];

  const chartData = period === "week" ? revenueByDay : revenueByMonth;
  const maxVal = Math.max(...chartData.map((d) => d.value));

  const periodLabel =
    period === "week" ? "هفته" : period === "month" ? "ماه" : "سال";

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="type-headline">نمای کلی</h1>
          <p className="type-caption mt-1">آمار فروشگاه WebSpeed</p>
        </div>
        <div className="flex gap-1 p-1 bg-muted">
          {(
            [
              ["week", "هفته"],
              ["month", "ماه"],
              ["year", "سال"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPeriod(key)}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                period === key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="border border-border p-4 sm:p-5 space-y-1">
          <p className="type-label text-muted-foreground">درآمد {periodLabel}</p>
          <p className="text-lg sm:text-xl font-bold num" data-num>
            {formatPrice(revenue)}
          </p>
        </div>
        <div className="border border-border p-4 sm:p-5 space-y-1">
          <p className="type-label text-muted-foreground">سفارش‌ها</p>
          <p className="text-lg sm:text-xl font-bold num" data-num>
            {formatNumber(orders)}
          </p>
        </div>
        <div className="border border-border p-4 sm:p-5 space-y-1">
          <p className="type-label text-muted-foreground">مشتری جدید</p>
          <p className="text-lg sm:text-xl font-bold num" data-num>
            {formatNumber(customers)}
          </p>
        </div>
        <div className="border border-border p-4 sm:p-5 space-y-1">
          <p className="type-label text-muted-foreground">میانگین سبد</p>
          <p className="text-lg sm:text-xl font-bold num" data-num>
            {formatPrice(adminStats.avgOrder)}
          </p>
        </div>
      </div>

      <div className="border border-border p-4 sm:p-6">
        <h2 className="type-title mb-6">
          روند فروش ({period === "week" ? "۷ روز اخیر" : "۶ ماه اخیر"})
        </h2>
        <div className="flex items-end gap-2 sm:gap-3 h-40 sm:h-48">
          {chartData.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div
                className="w-full bg-foreground/90 hover:bg-accent transition-colors min-h-[4px]"
                style={{ height: `${Math.max(4, (d.value / maxVal) * 100)}%` }}
                title={formatPrice(d.value)}
              />
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/admin/products"
          className="border border-border p-5 hover:bg-muted/50 transition-colors"
        >
          <p className="type-label text-muted-foreground mb-1">محصولات</p>
          <p className="text-2xl font-bold num">{formatNumber(products.length)}</p>
        </Link>
        <Link
          href="/admin/categories"
          className="border border-border p-5 hover:bg-muted/50 transition-colors"
        >
          <p className="type-label text-muted-foreground mb-1">دسته‌بندی‌ها</p>
          <p className="text-2xl font-bold num">
            {formatNumber(categories.filter((c) => c.id !== "all").length)}
          </p>
        </Link>
        <Link
          href="/admin/orders"
          className="border border-border p-5 hover:bg-muted/50 transition-colors"
        >
          <p className="type-label text-muted-foreground mb-1">در انتظار تأیید</p>
          <p className="text-2xl font-bold num">
            {formatNumber(mockOrders.filter((o) => o.status === "pending").length)}
          </p>
        </Link>
      </div>

      <div className="border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-border">
          <h2 className="type-title">آخرین سفارش‌ها</h2>
          <Link href="/admin/orders" className="type-caption underline underline-offset-2">
            همه
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/50 type-label text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">سفارش</th>
                <th className="px-4 py-3 font-semibold">مشتری</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">مبلغ</th>
                <th className="px-4 py-3 font-semibold">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-4 py-3 num font-medium" data-num>
                    {o.id}
                  </td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3 hidden sm:table-cell num" data-num>
                    {formatPrice(o.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs">{statusLabel[o.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
