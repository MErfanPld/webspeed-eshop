"use client";

import type {
  ProductGridBlock as ProductGridBlockType,
  PageBlock,
} from "@/builder/types";
import Container from "@/components/ui/Container";
import ProductGrid from "@/components/products/ProductGrid";
import { resolveProducts } from "@/lib/products-query";
import { useCatalog } from "@/context/CatalogContext";

export default function ProductGridBlockView({
  block,
}: {
  block: PageBlock;
}) {
  const data = (block as ProductGridBlockType).data;
  const { products: catalogProducts } = useCatalog();
  const list = resolveProducts({
    productIds: data.productIds,
    source: data.source,
    limit: data.limit ?? 8,
  }, catalogProducts);

  if (!list.length) return null;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        {data.title && (
          <h2 className="ws-heading text-xl sm:text-[1.7rem] font-extrabold tracking-tight mb-6 sm:mb-8">
            {data.title}
          </h2>
        )}
        <ProductGrid products={list} />
      </Container>
    </section>
  );
}
