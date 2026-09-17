"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

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
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
            priority={false}
          />
          <Image
            src={secondaryImage}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {product.newArrival && <Badge variant="new">جدید</Badge>}
            {hasDiscount && <Badge variant="sale">تخفیف</Badge>}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              // wishlist placeholder
            }}
            className="absolute top-3 left-3 p-2 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            aria-label="افزودن به علاقه‌مندی"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category.replace("-", " ")}
          </p>
          <h3 className="text-sm font-medium text-foreground line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
