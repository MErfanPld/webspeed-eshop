import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";
import { requireAdmin } from "@/server/http";
import { catalogService } from "@/server/services/catalog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params;
  const { store } = await requireAdmin();
  const categories = catalogService.listCategories(store.storeId);
  if (id === "new") return <ProductForm initial={null} categories={categories} />;
  const product = catalogService.getProduct(store.storeId, id);
  if (!product) notFound();
  return <ProductForm initial={product} categories={categories} />;
}
