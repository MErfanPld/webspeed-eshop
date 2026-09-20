"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
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
    <article className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f1ef] rounded-md">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 480px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={
              hasSecond
                ? "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] img-swap-a"
                : "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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

          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-end z-[1]">
            {hasDiscount && (
              <span className="bg-[var(--discount)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full num tracking-wide">
                {formatNumber(discountPct)}٪
              </span>
            )}
            {product.newArrival && (
              <span className="bg-foreground text-background text-[10px] font-semibold px-2 py-0.5 rounded-full">
                جدید
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-2.5 left-2.5 z-[1] h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
            aria-label="علاقه‌مندی"
          >
            <Heart className="h-3.5 w-3.5 text-foreground/70" strokeWidth={1.5} />
          </button>

          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <span className="block w-full text-center py-2.5 bg-foreground/90 text-background text-[11px] font-medium tracking-wide">
              مشاهده سریع
            </span>
          </div>
        </div>

        <div className="pt-3 space-y-1">
          {product.brand && (
            <p className="text-[10px] text-muted-foreground tracking-wide">
              {product.brand}
            </p>
          )}
          <h3 className="text-[13px] sm:text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-foreground/70 transition-colors">
            {product.name}
          </h3>

          {(product.rating != null || product.reviewCount != null) && (
            <div className="flex items-center gap-1 pt-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-medium num text-foreground/80" data-num>
                {(product.rating ?? 0).toFixed(1)}
              </span>
              <span className="text-[10px] text-muted-foreground num" data-num>
                ({formatNumber(product.reviewCount ?? 0)})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-sm font-semibold num text-foreground" data-num>
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span
                className="text-[11px] text-muted-foreground line-through num"
                data-num
              >
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {product.freeShipping && (
            <p className="text-[10px] text-emerald-600 font-medium pt-0.5">
              ارسال رایگان
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
