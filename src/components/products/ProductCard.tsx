"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export default function ProductCard({ product, priority }: ProductCardProps) {
  const hasSecond = product.images.length > 1;
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={
              hasSecond
                ? "object-cover img-swap-a"
                : "object-cover"
            }
          />
          {hasSecond && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover img-swap-b"
              aria-hidden
            />
          )}
          {product.newArrival && (
            <span className="absolute top-3 right-3 type-label text-foreground/70">
              جدید
            </span>
          )}
        </div>

        <div className="mt-3.5 space-y-1">
          <h3 className="type-body font-medium text-foreground line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="type-caption text-foreground num" data-num>
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="type-caption line-through opacity-50 num" data-num>
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
