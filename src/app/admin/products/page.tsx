"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCatalog } from "@/context/CatalogContext";
import type { ProductRecord } from "@/types/api";
import { formatPrice, formatNumber } from "@/lib/utils";
import { Package, Plus, Search } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminInput from "@/components/admin/ui/AdminInput";

const PAGE_SIZE = 25;

export default function AdminProductsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | ProductRecord["status"] | "out">("");
  const [page, setPage] = useState(1);
  const products = useCatalog().products as ProductRecord[];

  const all = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!s || p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s) || (p.brand || "").toLowerCase().includes(s)) &&
        (!status || (status === "out" ? p.stock <= 0 : p.status === status))
    );
  }, [q, status, products]);
  const pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const filtered = all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="محصولات"
        description={`${formatNumber(products.length)} محصول در کاتالوگ`}
        actions={
          <Link href="/admin/products/new">
            <AdminButton variant="primary">
              <Plus className="h-4 w-4" />
              افزودن محصول
            </AdminButton>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
          <AdminInput
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="جستجوی نام، برند یا اسلاگ..."
            className="pr-9"
          />
        </div>
        <select
          aria-label="فیلتر وضعیت"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as typeof status);
            setPage(1);
          }}
          className="h-10 rounded-xl border border-[#E8E8E8] bg-white px-3 text-sm"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="draft">پیش‌نویس</option>
          <option value="archived">بایگانی</option>
          <option value="out">ناموجود</option>
        </select>
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
              <Link key={p.id} href={`/admin/products/${p.id}`} className="p-4 flex gap-3 hover:bg-[#FAFAFA]">
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
                    {p.status !== "active" && <AdminBadge tone="warning">{p.status === "draft" ? "پیش‌نویس" : "بایگانی"}</AdminBadge>}
                  </div>
                </div>
              </Link>
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
                          <Link href={`/admin/products/${p.id}`} className="font-semibold text-[#111] truncate block hover:underline">
                            {p.name}
                          </Link>
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
                        {p.status !== "active" && <AdminBadge tone="warning">{p.status === "draft" ? "پیش‌نویس" : "بایگانی"}</AdminBadge>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {pages > 1 && (
        <nav className="flex items-center justify-between gap-3" aria-label="صفحه‌بندی">
          <span className="text-xs text-[#737373]">
            صفحه {formatNumber(current)} از {formatNumber(pages)} · {formatNumber(all.length)} محصول
          </span>
          <div className="flex gap-2">
            <AdminButton size="sm" disabled={current <= 1} onClick={() => setPage(current - 1)}>
              قبلی
            </AdminButton>
            <AdminButton size="sm" disabled={current >= pages} onClick={() => setPage(current + 1)}>
              بعدی
            </AdminButton>
          </div>
        </nav>
      )}
    </div>
  );
}
