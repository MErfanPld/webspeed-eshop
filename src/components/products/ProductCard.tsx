"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, formatNumber } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export default function ProductCard({ product, priority }: ProductCardProps) {
  const hasSecond = product.images.length > 1;
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  return (
    <article className="group bg-surface border border-border/80 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-concrete">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={hasSecond ? "object-cover img-swap-a" : "object-cover"}
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
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-[var(--discount)] text-white text-[11px] font-bold px-1.5 py-0.5 rounded num">
              {formatNumber(discountPct)}٪
            </span>
          )}
          {product.newArrival && !hasDiscount && (
            <span className="absolute top-2 right-2 bg-foreground text-background text-[10px] font-semibold px-1.5 py-0.5 rounded">
              جدید
            </span>
          )}
        </div>

        <div className="p-2.5 sm:p-3 space-y-1.5">
          <h3 className="text-[12px] sm:text-[13px] text-foreground/90 line-clamp-2 min-h-[2.5em] leading-snug">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="num font-medium text-foreground/80" data-num>
              {product.rating.toFixed(1)}
            </span>
            <span className="num" data-num>
              ({formatNumber(product.reviewCount)})
            </span>
          </div>

          <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
            {hasDiscount && (
              <span className="text-[11px] text-muted-foreground line-through num" data-num>
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
            <span className="text-[13px] sm:text-sm font-bold text-foreground num" data-num>
              {formatPrice(product.price)}
            </span>
          </div>

          {product.freeShipping && (
            <p className="text-[10px] text-emerald-600 font-medium">ارسال رایگان</p>
          )}
        </div>
      </Link>
    </article>
  );
}
