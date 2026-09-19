"use client";

import { mockOrders, statusLabel } from "@/data/admin";
import { formatPrice, formatNumber } from "@/lib/utils";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="type-headline">سفارش‌ها</h1>
        <p className="type-caption mt-1">
          {formatNumber(mockOrders.length)} سفارش اخیر
        </p>
      </div>

      <div className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/50 type-label text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">شماره</th>
                <th className="px-4 py-3 font-semibold">مشتری</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">تماس</th>
                <th className="px-4 py-3 font-semibold">مبلغ</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">اقلام</th>
                <th className="px-4 py-3 font-semibold">وضعیت</th>
                <th className="px-4 py-3 font-semibold hidden lg:table-cell">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-4 py-3 num font-medium" data-num>
                    {o.id}
                  </td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3 num hidden sm:table-cell" dir="ltr" data-num>
                    {o.phone}
                  </td>
                  <td className="px-4 py-3 num" data-num>
                    {formatPrice(o.total)}
                  </td>
                  <td className="px-4 py-3 num hidden md:table-cell" data-num>
                    {formatNumber(o.items)}
                  </td>
                  <td className="px-4 py-3 text-xs">{statusLabel[o.status]}</td>
                  <td className="px-4 py-3 type-caption hidden lg:table-cell num" data-num>
                    {o.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="type-caption">
        سفارش‌های با وضعیت «در انتظار تأیید» پس از بررسی رسید کارت‌به‌کارت تأیید
        می‌شوند.
      </p>
    </div>
  );
}
