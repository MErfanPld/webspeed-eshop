"use client";

import { mockCustomers } from "@/data/admin";
import { formatPrice, formatNumber } from "@/lib/utils";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="type-headline">مشتری‌ها</h1>
        <p className="type-caption mt-1">
          {formatNumber(mockCustomers.length)} مشتری
        </p>
      </div>

      <div className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/50 type-label text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">نام</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">تماس</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">ایمیل</th>
                <th className="px-4 py-3 font-semibold">سفارش‌ها</th>
                <th className="px-4 py-3 font-semibold">مجموع خرید</th>
                <th className="px-4 py-3 font-semibold hidden lg:table-cell">عضویت</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 num hidden sm:table-cell" dir="ltr" data-num>
                    {c.phone}
                  </td>
                  <td className="px-4 py-3 type-caption hidden md:table-cell">
                    {c.email}
                  </td>
                  <td className="px-4 py-3 num" data-num>
                    {formatNumber(c.orders)}
                  </td>
                  <td className="px-4 py-3 num" data-num>
                    {formatPrice(c.totalSpent)}
                  </td>
                  <td className="px-4 py-3 type-caption hidden lg:table-cell num" data-num>
                    {c.joined}
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
