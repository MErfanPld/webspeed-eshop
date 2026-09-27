import type {
  ProductGridBlock as ProductGridBlockType,
  PageBlock,
} from "@/builder/types";
import Container from "@/components/ui/Container";
import ProductGrid from "@/components/products/ProductGrid";
import { resolveProducts } from "@/lib/products-query";

export default function ProductGridBlockView({
  block,
}: {
  block: PageBlock;
}) {
  const data = (block as ProductGridBlockType).data;
  const list = resolveProducts({
    productIds: data.productIds,
    source: data.source,
    limit: data.limit ?? 8,
  });

  if (!list.length) return null;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        {data.title && (
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6 sm:mb-8">
            {data.title}
          </h2>
        )}
        <ProductGrid products={list} />
      </Container>
    </section>
  );
}
