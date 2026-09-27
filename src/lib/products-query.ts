import { products } from "@/data/products";
import type { Product } from "@/types/product";

export type ProductSource = "featured" | "new" | "bestsellers" | "all";

export function resolveProducts(options: {
  productIds?: string[];
  source?: ProductSource;
  limit?: number;
}): Product[] {
  const { productIds, source = "all", limit = 8 } = options;

  if (productIds?.length) {
    const map = new Map(products.map((p) => [p.id, p]));
    return productIds
      .map((id) => map.get(id))
      .filter(Boolean)
      .slice(0, limit) as Product[];
  }

  let list = [...products];
  switch (source) {
    case "featured":
      list = list.filter((p) => p.featured);
      break;
    case "new":
      list = list.filter((p) => p.newArrival);
      break;
    case "bestsellers":
      list = [...list].sort(
        (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
      );
      break;
    default:
      break;
  }

  return list.slice(0, limit);
}
