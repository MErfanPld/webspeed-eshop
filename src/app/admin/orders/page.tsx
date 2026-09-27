"use client";

import { mockOrders, statusLabel } from "@/data/admin";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

const statusStyle: Record<string, string> = {
  delivered: "bg-[#E6FFFA] text-[#13DEB9]",
  cancelled: "bg-[#FDEDE8] text-[#FA896B]",
  pending: "bg-[#FEF5E5] text-[#FFAE1F]",
  confirmed: "bg-[#ECF2FF] text-[#5D87FF]",
  shipped: "bg-[#ECF2FF] text-[#5D87FF]",
};

export default function AdminOrdersPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-5" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#2A3547]">سفارش‌ها</h1>
        <p className="text-sm text-[#7C8FAC] mt-1">{mockOrders.length} سفارش ثبت‌شده</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5EAEF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        {!mockOrders.length ? (
          <div className="py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-[#FEF5E5] mx-auto flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-[#FFAE1F]" />
            </div>
            <p className="font-semibold text-[#2A3547]">هنوز سفارشی ندارید</p>
          </div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-[#E5EAEF]">
              {mockOrders.map((o) => (
                <div key={o.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#2A3547]">{o.customer}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyle[o.status] || statusStyle.pending}`}>
                      {statusLabel[o.status]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#7C8FAC]">
                    <span className="tabular-nums">{o.id}</span>
                    <span className="font-semibold text-[#2A3547] tabular-nums">{formatPrice(o.total)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E5EAEF]">
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">شماره</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">مشتری</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">تاریخ</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">مبلغ</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((o) => (
                    <tr key={o.id} className="border-b border-[#E5EAEF] last:border-0 hover:bg-[#F8FAFC]">
                      <td className="px-5 py-3.5 font-semibold text-[#2A3547] tabular-nums">{o.id}</td>
                      <td className="px-5 py-3.5 text-[#2A3547]">{o.customer}</td>
                      <td className="px-5 py-3.5 text-[#7C8FAC] tabular-nums">{o.date}</td>
                      <td className="px-5 py-3.5 font-semibold text-[#2A3547] tabular-nums">{formatPrice(o.total)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyle[o.status] || statusStyle.pending}`}>
                          {statusLabel[o.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
