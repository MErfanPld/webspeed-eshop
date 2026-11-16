import "server-only";
import { cache } from "react";
import type { ManagedPage } from "@/builder/contracts/page-contract";
import type { Category, Pagination, Product, PublicStore } from "@/types/api";
import { serverApi, serverApiOrNull } from "./server";

/**
 * Public storefront data for the current request host (no authentication).
 * Every getter is wrapped in React `cache()`: layouts, pages and
 * generateMetadata of one request share a single API call.
 */

export const getStoreInfo = cache(async function getStoreInfo(): Promise<PublicStore> {
  return (await serverApi<{ store: PublicStore }>("/store")).store;
});

export const getPublishedPage = cache(async function getPublishedPage(id: string): Promise<ManagedPage | null> {
  return (await serverApiOrNull<{ page: ManagedPage }>(`/pages?id=${encodeURIComponent(id)}`))?.page ?? null;
});

export const getPublishedPageBySlug = cache(async function getPublishedPageBySlug(slug: string): Promise<ManagedPage | null> {
  return (await serverApiOrNull<{ page: ManagedPage }>(`/pages?slug=${encodeURIComponent(slug)}`))?.page ?? null;
});

export const getProductBySlug = cache(async function getProductBySlug(slug: string): Promise<Product | null> {
  return (await serverApiOrNull<{ product: Product }>(`/products/${encodeURIComponent(slug)}`))?.product ?? null;
});

/** Whole active catalog (paged through the API) for client-side blocks and filters */
export const getCatalog = cache(async function getCatalog(): Promise<{ products: Product[]; categories: Category[] }> {
  const [first, cats] = await Promise.all([
    serverApi<{ products: Product[]; pagination: Pagination }>("/products?pageSize=100&page=1"),
    serverApi<{ categories: Category[] }>("/categories"),
  ]);
  // Remaining pages in parallel (not one after another)
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, Math.min(first.pagination.pages, 50) - 1) }, (_, i) =>
      serverApi<{ products: Product[] }>(`/products?pageSize=100&page=${i + 2}`)
    )
  );
  return { products: [...first.products, ...rest.flatMap((r) => r.products)], categories: cats.categories };
});
