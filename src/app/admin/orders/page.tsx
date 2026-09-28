"use client";

import { useMemo, useState } from "react";
import { mockOrders, statusLabel, type AdminOrder } from "@/data/admin";
import { formatPrice, formatNumber } from "@/lib/utils";
import { ShoppingBag, Search } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminInput from "@/components/admin/ui/AdminInput";
import { cn } from "@/lib/utils";

const statusTone: Record<
  AdminOrder["status"],
  "warning" | "info" | "success" | "neutral" | "danger"
> = {
  pending: "warning",
  confirmed: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

export default function AdminOrdersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | AdminOrder["status"]>("all");

  const filtered = useMemo(() => {
    return mockOrders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (!q.trim()) return true;
      const s = q.trim().toLowerCase();
      return (
        o.id.toLowerCase().includes(s) ||
        o.customer.toLowerCase().includes(s) ||
        o.phone.includes(s)
      );
    });
  }, [q, status]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="سفارش‌ها"
        description={`${formatNumber(mockOrders.length)} سفارش`}
      />

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
          <AdminInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="کد سفارش، مشتری یا موبایل..."
            className="pr-9"
          />
        </div>
        <div className="flex flex-wrap gap-1 p-0.5 bg-[#F0F0F0] rounded-xl">
          {(
            [
              ["all", "همه"],
              ["pending", "در انتظار"],
              ["confirmed", "تأیید"],
              ["shipped", "ارسال"],
              ["delivered", "تحویل"],
              ["cancelled", "لغو"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className={cn(
                "h-8 px-2.5 rounded-lg text-[11px] font-semibold transition-colors",
                status === key
                  ? "bg-white text-[#111] shadow-sm"
                  : "text-[#737373] hover:text-[#111]"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!filtered.length ? (
        <AdminEmptyState
          icon={<ShoppingBag className="h-5 w-5" />}
          title="سفارشی یافت نشد"
          description="فیلتر یا جستجو را تغییر دهید."
        />
      ) : (
        <div className="rounded-2xl border border-[#E8E8E8] bg-white overflow-hidden">
          <div className="md:hidden divide-y divide-[#F0F0F0]">
            {filtered.map((o) => (
              <div key={o.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#111] font-mono">{o.id}</p>
                    <p className="text-xs text-[#737373] mt-0.5">{o.customer}</p>
                  </div>
                  <AdminBadge tone={statusTone[o.status]}>{statusLabel[o.status]}</AdminBadge>
                </div>
                <div className="flex items-center justify-between text-xs text-[#525252]">
                  <span className="tabular-nums">{formatPrice(o.total)}</span>
                  <span className="tabular-nums">{o.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA] text-[11px] text-[#737373]">
                  <th className="font-semibold px-5 py-3">کد</th>
                  <th className="font-semibold px-3 py-3">مشتری</th>
                  <th className="font-semibold px-3 py-3">مبلغ</th>
                  <th className="font-semibold px-3 py-3">اقلام</th>
                  <th className="font-semibold px-3 py-3">تاریخ</th>
                  <th className="font-semibold px-5 py-3">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-[#525252]">{o.id}</td>
                    <td className="px-3 py-3.5">
                      <p className="font-semibold text-[#111]">{o.customer}</p>
                      <p className="text-[11px] text-[#A3A3A3] tabular-nums dir-ltr text-right">{o.phone}</p>
                    </td>
                    <td className="px-3 py-3.5 tabular-nums font-medium text-[#111]">{formatPrice(o.total)}</td>
                    <td className="px-3 py-3.5 tabular-nums text-[#525252]">{o.items}</td>
                    <td className="px-3 py-3.5 tabular-nums text-[#525252]">{o.date}</td>
                    <td className="px-5 py-3.5">
                      <AdminBadge tone={statusTone[o.status]}>{statusLabel[o.status]}</AdminBadge>
                    </td>
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
