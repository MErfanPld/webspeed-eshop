"use client";

import { mockCustomers } from "@/data/admin";
import { formatPrice, formatNumber } from "@/lib/utils";
import { Search, Users, MoreHorizontal } from "lucide-react";

const avatarColors = [
  "bg-[#5D87FF]",
  "bg-[#13DEB9]",
  "bg-[#FFAE1F]",
  "bg-[#FA896B]",
  "bg-[#8B5CF6]",
  "bg-[#0EA5E9]",
];

export default function AdminCustomersPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-5" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#2A3547]">مشتری‌ها</h1>
          <p className="text-sm text-[#7C8FAC] mt-1">{formatNumber(mockCustomers.length)} مشتری ثبت‌شده</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "کل مشتریان", value: formatNumber(mockCustomers.length), color: "text-[#5D87FF]" },
          { label: "مجموع خرید", value: formatPrice(mockCustomers.reduce((s, c) => s + c.totalSpent, 0)), color: "text-[#13DEB9]" },
          { label: "میانگین سفارش", value: formatNumber(Math.round(mockCustomers.reduce((s, c) => s + c.orders, 0) / Math.max(mockCustomers.length, 1))), color: "text-[#FFAE1F]" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E5EAEF] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-medium text-[#7C8FAC]">{s.label}</p>
            <p className={`text-lg font-bold mt-1 tabular-nums ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E5EAEF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-[#E5EAEF]">
          <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl border border-[#E5EAEF] bg-[#F0F5F9]">
            <Search className="h-4 w-4 text-[#7C8FAC] shrink-0" />
            <input placeholder="جستجوی نام، موبایل یا ایمیل..." className="flex-1 bg-transparent text-sm outline-none text-[#2A3547] placeholder:text-[#7C8FAC]/70" />
          </div>
        </div>

        {!mockCustomers.length ? (
          <div className="py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-[#ECF2FF] mx-auto flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-[#5D87FF]" />
            </div>
            <p className="font-semibold text-[#2A3547]">مشتری‌ای یافت نشد</p>
          </div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-[#E5EAEF]">
              {mockCustomers.map((c, i) => (
                <div key={c.id} className="p-4 flex gap-3 items-center">
                  <div className={`h-11 w-11 rounded-full ${avatarColors[i % avatarColors.length]} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#2A3547] truncate">{c.name}</p>
                    <p className="text-xs text-[#7C8FAC] mt-0.5 tabular-nums dir-ltr text-right">{c.phone}</p>
                    <p className="text-xs font-semibold text-[#5D87FF] mt-1 tabular-nums">
                      {formatPrice(c.totalSpent)} · {c.orders} سفارش
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E5EAEF]">
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">مشتری</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">تماس</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">سفارش‌ها</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">مجموع خرید</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">عضویت</th>
                    <th className="px-5 py-3.5 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {mockCustomers.map((c, i) => (
                    <tr key={c.id} className="border-b border-[#E5EAEF] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full ${avatarColors[i % avatarColors.length]} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                            {c.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#2A3547]">{c.name}</p>
                            <p className="text-xs text-[#7C8FAC] mt-0.5 truncate">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#7C8FAC] tabular-nums dir-ltr text-right">{c.phone}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex min-w-[2rem] justify-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#ECF2FF] text-[#5D87FF]">{c.orders}</span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-[#2A3547] tabular-nums">{formatPrice(c.totalSpent)}</td>
                      <td className="px-5 py-3.5 text-[#7C8FAC] tabular-nums">{c.joined}</td>
                      <td className="px-5 py-3.5">
                        <button type="button" className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-[#7C8FAC] hover:bg-[#F0F5F9]" aria-label="بیشتر">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
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
