import CategoriesManager from "@/components/admin/catalog/CategoriesManager";
import { adminApi } from "@/lib/api/admin";
import type { Category, ProductRecord } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [{ categories }, { products }] = await Promise.all([
    adminApi<{ categories: Category[] }>("/admin/categories"),
    adminApi<{ products: ProductRecord[] }>("/admin/products"),
  ]);
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
  return <CategoriesManager categories={categories.filter((c) => c.id !== "all")} counts={counts} />;
}
