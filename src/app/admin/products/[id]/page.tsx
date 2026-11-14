import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";
import { adminApi } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { Category, ProductRecord } from "@/types/api";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params;
  const { categories } = await adminApi<{ categories: Category[] }>("/admin/categories");
  if (id === "new") return <ProductForm initial={null} categories={categories} />;
  try {
    const { product } = await adminApi<{ product: ProductRecord }>(`/admin/products/${encodeURIComponent(id)}`);
    return <ProductForm initial={product} categories={categories} />;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
