"use client";

import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { Package, Plus, Search, MoreHorizontal } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-5" style={{ fontFamily: "Vazirmatn, Tahoma, sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#2A3547]">محصولات</h1>
          <p className="text-sm text-[#7C8FAC] mt-1">{products.length} محصول در کاتالوگ</p>
        </div>
        <button type="button" disabled className="h-11 px-5 rounded-xl bg-[#5D87FF] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 opacity-70 cursor-not-allowed shadow-md shadow-[#5D87FF]/20">
          <Plus className="h-4 w-4" />
          افزودن محصول
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5EAEF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-[#E5EAEF]">
          <div className="flex items-center gap-2 h-11 px-3.5 rounded-xl border border-[#E5EAEF] bg-[#F0F5F9]">
            <Search className="h-4 w-4 text-[#7C8FAC] shrink-0" />
            <input placeholder="جستجوی نام محصول..." className="flex-1 bg-transparent text-sm outline-none text-[#2A3547] placeholder:text-[#7C8FAC]/70" />
          </div>
        </div>

        {!products.length ? (
          <div className="py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-[#ECF2FF] mx-auto flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-[#5D87FF]" />
            </div>
            <p className="font-semibold text-[#2A3547]">هنوز محصولی ندارید</p>
          </div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-[#E5EAEF]">
              {products.slice(0, 24).map((p) => (
                <div key={p.id} className="p-4 flex gap-3 items-center">
                  <div className="h-14 w-12 rounded-xl bg-[#F0F5F9] overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0] || "/placeholders/samsung-banner.webp"} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#2A3547] truncate">{p.name}</p>
                    <p className="text-xs text-[#7C8FAC] mt-0.5 tabular-nums">{formatPrice(p.price)}</p>
                    <span className={`inline-flex mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.stock === 0 ? "bg-[#FDEDE8] text-[#FA896B]" : "bg-[#E6FFFA] text-[#13DEB9]"}`}>
                      {p.stock === 0 ? "ناموجود" : `موجود · ${p.stock}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E5EAEF]">
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">محصول</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">دسته‌بندی</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">قیمت</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">موجودی</th>
                    <th className="text-right px-5 py-3.5 text-[12px] font-semibold text-[#7C8FAC]">وضعیت</th>
                    <th className="px-5 py-3.5 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 40).map((p) => (
                    <tr key={p.id} className="border-b border-[#E5EAEF] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-9 rounded-lg bg-[#F0F5F9] overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.images?.[0] || "/placeholders/samsung-banner.webp"} alt="" className="h-full w-full object-cover" />
                          </div>
                          <span className="font-semibold text-[#2A3547] line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#7C8FAC]">{p.category}</td>
                      <td className="px-5 py-3.5 font-semibold text-[#2A3547] tabular-nums">{formatPrice(p.price)}</td>
                      <td className="px-5 py-3.5 text-[#7C8FAC] tabular-nums">{p.stock}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${p.stock === 0 ? "bg-[#FDEDE8] text-[#FA896B]" : "bg-[#E6FFFA] text-[#13DEB9]"}`}>
                          {p.stock === 0 ? "ناموجود" : "موجود"}
                        </span>
                      </td>
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
