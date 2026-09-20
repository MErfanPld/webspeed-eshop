import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  className?: string;
};

function withDefaults(p: Product): Product {
  return {
    ...p,
    rating: p.rating ?? 4.2,
    reviewCount: p.reviewCount ?? 0,
    freeShipping: p.freeShipping ?? false,
  };
}

export default function ProductGrid({ products, className }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="type-body text-muted-foreground">محصولی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 ${className || ""}`}
    >
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={withDefaults(product)}
          priority={i < 4}
        />
      ))}
    </div>
  );
}
