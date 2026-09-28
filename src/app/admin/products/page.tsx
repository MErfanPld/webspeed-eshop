"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { formatPrice, formatNumber } from "@/lib/utils";
import { Package, Plus, Search } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminInput from "@/components/admin/ui/AdminInput";

export default function AdminProductsPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return products;
    const s = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.slug.toLowerCase().includes(s) ||
        (p.brand || "").toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="محصولات"
        description={`${formatNumber(products.length)} محصول در کاتالوگ`}
        actions={
          <AdminButton variant="primary" disabled title="به‌زودی">
            <Plus className="h-4 w-4" />
            افزودن محصول
          </AdminButton>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
        <AdminInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجوی نام، برند یا اسلاگ..."
          className="pr-9"
        />
      </div>

      {!filtered.length ? (
        <AdminEmptyState
          icon={<Package className="h-5 w-5" />}
          title={products.length === 0 ? "هنوز محصولی ندارید" : "نتیجه‌ای یافت نشد"}
          description={
            products.length === 0
              ? "اولین محصول را به کاتالوگ اضافه کنید."
              : "عبارت جستجو را تغییر دهید."
          }
        />
      ) : (
        <div className="rounded-2xl border border-[#E8E8E8] bg-white overflow-hidden">
          <div className="md:hidden divide-y divide-[#F0F0F0]">
            {filtered.map((p) => (
              <div key={p.id} className="p-4 flex gap-3">
                <div className="h-14 w-12 rounded-lg bg-[#F7F7F7] overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#111] line-clamp-1">{p.name}</p>
                  <p className="text-xs text-[#737373] mt-0.5 tabular-nums">{formatPrice(p.price)}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.stock > 0 ? (
                      <AdminBadge tone="success">موجود</AdminBadge>
                    ) : (
                      <AdminBadge tone="danger">ناموجود</AdminBadge>
                    )}
                    {p.newArrival && <AdminBadge tone="info">جدید</AdminBadge>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA] text-[11px] text-[#737373]">
                  <th className="font-semibold px-5 py-3">محصول</th>
                  <th className="font-semibold px-3 py-3">قیمت</th>
                  <th className="font-semibold px-3 py-3">دسته</th>
                  <th className="font-semibold px-3 py-3">موجودی</th>
                  <th className="font-semibold px-5 py-3">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-11 w-9 rounded-lg bg-[#F7F7F7] overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#111] truncate">{p.name}</p>
                          <p className="text-[11px] text-[#A3A3A3] font-mono truncate">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 tabular-nums text-[#111] font-medium">{formatPrice(p.price)}</td>
                    <td className="px-3 py-3.5 text-[#525252]">{p.category}</td>
                    <td className="px-3 py-3.5 tabular-nums text-[#525252]">{p.stock}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {p.stock > 0 ? (
                          <AdminBadge tone="success">موجود</AdminBadge>
                        ) : (
                          <AdminBadge tone="danger">ناموجود</AdminBadge>
                        )}
                        {p.newArrival && <AdminBadge tone="info">جدید</AdminBadge>}
                      </div>
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
