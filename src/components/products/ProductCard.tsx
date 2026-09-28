"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice, formatNumber, cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export default function ProductCard({ product, priority }: ProductCardProps) {
  const { addItem } = useCart();
  const hasDiscount =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100
      )
    : 0;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes[0];
    const color = product.colors[0]?.name;
    if (!size || !color) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      color,
      quantity: 1,
    });
  };

  return (
    <article className="group relative flex flex-col bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
          <Image
            src={product.images[0] || "/placeholders/samsung-banner.webp"}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          />

          {hasDiscount && (
            <span className="absolute top-2 right-2 z-[1] rounded-md bg-primary text-white text-[11px] font-bold px-1.5 py-0.5 num leading-none">
              {formatNumber(discountPct)}٪
            </span>
          )}

          {product.newArrival && !hasDiscount && (
            <span className="absolute top-2 right-2 z-[1] rounded-md bg-foreground text-white text-[10px] font-semibold px-1.5 py-0.5">
              جدید
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-2 left-2 z-[1] h-8 w-8 rounded-full bg-white/95 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
            aria-label="علاقه‌مندی"
          >
            <Heart className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-3 sm:p-3.5 gap-1.5">
        {product.brand && (
          <p className="text-[10px] text-muted-foreground font-medium truncate">{product.brand}</p>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[13px] sm:text-sm font-medium leading-snug line-clamp-2 min-h-[2.4em] hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-medium num">{(product.rating ?? 4.5).toFixed(1)}</span>
          <span className="text-[10px] text-muted-foreground num">
            ({formatNumber(product.reviewCount ?? 0)})
          </span>
        </div>

        <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
          <span
            className={cn(
              "text-sm sm:text-[15px] font-bold num",
              hasDiscount ? "text-primary" : "text-foreground"
            )}
          >
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-muted-foreground line-through num">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {product.freeShipping && (
          <p className="text-[10px] text-success font-medium">ارسال رایگان</p>
        )}

        <button
          type="button"
          onClick={quickAdd}
          className="mt-auto pt-2 w-full h-9 rounded-lg border border-[#E5E5E5] bg-white text-[#111] text-[12px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-colors"
        >
          <ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.75} />
          افزودن به سبد
        </button>
      </div>
    </article>
  );
}
