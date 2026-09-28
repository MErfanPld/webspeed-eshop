"use client";

import { useMemo, useState } from "react";
import { mockCustomers } from "@/data/admin";
import { formatPrice, formatNumber } from "@/lib/utils";
import { Users, Search } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminInput from "@/components/admin/ui/AdminInput";

export default function AdminCustomersPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return mockCustomers;
    const s = q.trim().toLowerCase();
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.phone.includes(s)
    );
  }, [q]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="مشتری‌ها"
        description={`${formatNumber(mockCustomers.length)} مشتری`}
      />

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
        <AdminInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="نام، ایمیل یا موبایل..."
          className="pr-9"
        />
      </div>

      {!filtered.length ? (
        <AdminEmptyState
          icon={<Users className="h-5 w-5" />}
          title="مشتری‌ای یافت نشد"
          description="عبارت جستجو را تغییر دهید."
        />
      ) : (
        <div className="rounded-2xl border border-[#E8E8E8] bg-white overflow-hidden">
          <div className="md:hidden divide-y divide-[#F0F0F0]">
            {filtered.map((c) => (
              <div key={c.id} className="p-4 flex gap-3 items-center">
                <div className="h-10 w-10 rounded-full bg-[#111] text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#111]">{c.name}</p>
                  <p className="text-xs text-[#737373] truncate">{c.email}</p>
                  <div className="mt-1.5 flex gap-1.5 items-center">
                    <AdminBadge tone="neutral">{c.orders} سفارش</AdminBadge>
                    <span className="text-[11px] text-[#525252] tabular-nums">{formatPrice(c.totalSpent)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA] text-[11px] text-[#737373]">
                  <th className="font-semibold px-5 py-3">مشتری</th>
                  <th className="font-semibold px-3 py-3">موبایل</th>
                  <th className="font-semibold px-3 py-3">سفارش‌ها</th>
                  <th className="font-semibold px-3 py-3">مجموع خرید</th>
                  <th className="font-semibold px-5 py-3">عضویت</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-[#111] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#111]">{c.name}</p>
                          <p className="text-[11px] text-[#A3A3A3] truncate">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-[#525252] tabular-nums dir-ltr text-right">{c.phone}</td>
                    <td className="px-3 py-3.5">
                      <AdminBadge tone="neutral">{c.orders}</AdminBadge>
                    </td>
                    <td className="px-3 py-3.5 tabular-nums font-medium text-[#111]">{formatPrice(c.totalSpent)}</td>
                    <td className="px-5 py-3.5 tabular-nums text-[#525252]">{c.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
