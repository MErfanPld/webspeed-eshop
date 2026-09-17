"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export default function ProductCard({ product, className }: ProductCardProps) {
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const secondaryImage = product.images[1] || product.images[0];

  return (
    <article className={cn("group relative", className)}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f0eeeb]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover product-card-img-primary"
            priority={false}
          />
          {product.images[1] && (
            <Image
              src={secondaryImage}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover product-card-img-secondary absolute inset-0"
              aria-hidden
            />
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {product.newArrival && (
              <span className="bg-white/95 text-[11px] font-medium tracking-wide px-2.5 py-1 text-foreground">
                جدید
              </span>
            )}
            {hasDiscount && (
              <span className="bg-foreground text-[11px] font-medium tracking-wide px-2.5 py-1 text-background">
                تخفیف
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute top-2 left-2 z-10 flex h-11 w-11 items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
            aria-label="افزودن به علاقه‌مندی‌ها"
          >
            <Heart className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-3.5 space-y-1 px-0.5">
          <p className="text-meta text-muted-foreground">
            {product.category.replace(/-/g, " ")}
          </p>
          <h3 className="text-product text-foreground truncate">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-sm font-medium text-foreground tabular-nums">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through tabular-nums">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
