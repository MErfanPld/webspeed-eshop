import "server-only";
import type { ManagedPage } from "@/builder/contracts/page-contract";
import type { Category, Pagination, Product, PublicStore } from "@/types/api";
import { serverApi, serverApiOrNull } from "./server";

/** Public storefront data for the current request host (no authentication). */

export async function getStoreInfo(): Promise<PublicStore> {
  return (await serverApi<{ store: PublicStore }>("/store")).store;
}

export async function getPublishedPage(id: string): Promise<ManagedPage | null> {
  return (await serverApiOrNull<{ page: ManagedPage }>(`/pages?id=${encodeURIComponent(id)}`))?.page ?? null;
}

export async function getPublishedPageBySlug(slug: string): Promise<ManagedPage | null> {
  return (await serverApiOrNull<{ page: ManagedPage }>(`/pages?slug=${encodeURIComponent(slug)}`))?.page ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return (await serverApiOrNull<{ product: Product }>(`/products/${encodeURIComponent(slug)}`))?.product ?? null;
}

/** Whole active catalog (paged through the API) for client-side blocks and filters */
export async function getCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  const [first, cats] = await Promise.all([
    serverApi<{ products: Product[]; pagination: Pagination }>("/products?pageSize=100&page=1"),
    serverApi<{ categories: Category[] }>("/categories"),
  ]);
  const products = [...first.products];
  for (let page = 2; page <= Math.min(first.pagination.pages, 50); page++) {
    const next = await serverApi<{ products: Product[] }>(`/products?pageSize=100&page=${page}`);
    products.push(...next.products);
  }
  return { products, categories: cats.categories };
}
