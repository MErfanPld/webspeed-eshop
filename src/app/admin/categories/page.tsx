import CategoriesManager from "@/components/admin/catalog/CategoriesManager";
import { requireAdmin } from "@/server/http";
import { catalogService } from "@/server/services/catalog";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const { store } = await requireAdmin();
  const categories = catalogService.listCategories(store.storeId).filter((c) => c.id !== "all");
  const counts: Record<string, number> = {};
  for (const p of catalogService.listProducts(store.storeId, { includeInactive: true })) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  }
  return <CategoriesManager categories={categories} counts={counts} />;
}
