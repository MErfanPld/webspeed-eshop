"use client";

import { useMemo, useState } from "react";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { FolderTree, Plus, Search } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminInput from "@/components/admin/ui/AdminInput";

export default function AdminCategoriesPage() {
  const [q, setQ] = useState("");
  const list = categories.filter((c) => c.id !== "all");

  const filtered = useMemo(() => {
    if (!q.trim()) return list;
    const s = q.trim().toLowerCase();
    return list.filter(
      (c) => c.name.toLowerCase().includes(s) || c.slug.toLowerCase().includes(s)
    );
  }, [q, list]);

  const countFor = (slug: string) => products.filter((p) => p.category === slug).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="دسته‌بندی‌ها"
        description={`${list.length} دسته`}
        actions={
          <AdminButton variant="primary" disabled title="به‌زودی">
            <Plus className="h-4 w-4" />
            دسته جدید
          </AdminButton>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
        <AdminInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجوی دسته..."
          className="pr-9"
        />
      </div>

      {!filtered.length ? (
        <AdminEmptyState
          icon={<FolderTree className="h-5 w-5" />}
          title="دسته‌ای یافت نشد"
          description="عبارت جستجو را تغییر دهید."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-[#E8E8E8] bg-white p-4 hover:border-[#D4D4D4] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#F7F7F7] overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image || "/placeholders/cat-1.svg"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#111]">{c.name}</p>
                  <p className="text-[11px] text-[#A3A3A3] font-mono mt-0.5">{c.slug}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <AdminBadge tone="neutral">{countFor(c.slug)} محصول</AdminBadge>
                    {c.children?.length ? (
                      <AdminBadge tone="info">{c.children.length} زیردسته</AdminBadge>
                    ) : null}
                  </div>
                </div>
              </div>
              {c.children && c.children.length > 0 && (
                <ul className="mt-3 pt-3 border-t border-[#F0F0F0] space-y-1">
                  {c.children.map((ch) => (
                    <li
                      key={ch.slug + ch.name}
                      className="text-xs text-[#525252] flex items-center justify-between"
                    >
                      <span>{ch.name}</span>
                      <span className="text-[#A3A3A3] font-mono text-[10px]">{ch.slug}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
