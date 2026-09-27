"use client";

import { categories } from "@/data/categories";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminBadge from "@/components/admin/ui/AdminBadge";

export default function AdminCategoriesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader
        title="دسته‌بندی‌ها"
        description={`${categories.length} دسته فعال`}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => (
          <AdminCard key={c.id} className="!p-4">
            <p className="text-sm font-semibold">{c.name}</p>
            <p className="text-xs text-[var(--admin-text-secondary)] mt-1 font-mono">{c.slug}</p>
            <AdminBadge className="mt-3">فعال</AdminBadge>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
