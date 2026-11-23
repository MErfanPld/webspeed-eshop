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
    <article className="group relative flex flex-col bg-surface rounded-2xl border border-border/70 overflow-hidden shadow-[0_1px_2px_rgba(30,27,46,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(124,58,237,0.35)] hover:border-primary/20">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
          <Image
            src={product.images[0] || "/placeholders/product-1.svg"}
            alt={product.name}
            fill
            priority={priority}
            className={cn(
              "object-cover transition-all duration-700 ease-out group-hover:scale-[1.07]",
              product.images[1] && "group-hover:opacity-0"
            )}
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          />
          {/* Second photo fades in on hover */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              aria-hidden
              className="object-cover opacity-0 scale-105 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-100"
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            />
          )}

          <div className="absolute top-2.5 right-2.5 z-[1] flex flex-col items-start gap-1.5">
            {hasDiscount && (
              <span className="rounded-full bg-gradient-to-l from-[#f43f5e] to-[#f97316] text-white text-[11px] font-bold px-2 py-1 num leading-none shadow-sm">
                {formatNumber(discountPct)}٪ تخفیف
              </span>
            )}
            {product.newArrival && (
              <span className="rounded-full bg-brand-gradient text-white text-[10px] font-bold px-2 py-1 leading-none shadow-sm">
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
            className="absolute top-2.5 left-2.5 z-[1] h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:text-accent hover:scale-110"
            aria-label="علاقه‌مندی"
          >
            <Heart className="h-4 w-4" strokeWidth={1.75} />
          </button>

          {/* Quick add slides up on hover (desktop); always available below on touch */}
          <button
            type="button"
            onClick={quickAdd}
            tabIndex={-1}
            aria-hidden
            className="hidden md:flex absolute inset-x-3 bottom-3 z-[1] h-10 rounded-xl bg-white/95 backdrop-blur text-foreground text-[12px] font-bold items-center justify-center gap-1.5 shadow-lg translate-y-[130%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
            افزودن سریع
          </button>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-1.5">
        <div className="flex items-center justify-between gap-2">
          {product.brand ? (
            <p className="text-[10px] font-semibold text-primary/80 truncate">{product.brand}</p>
          ) : (
            <span />
          )}
          {(product.reviewCount ?? 0) > 0 && (
            <span className="inline-flex items-center gap-0.5 shrink-0">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-semibold num">{(product.rating ?? 0).toFixed(1)}</span>
              <span className="text-[10px] text-muted-foreground num">({formatNumber(product.reviewCount ?? 0)})</span>
            </span>
          )}
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[13px] sm:text-sm font-semibold leading-snug line-clamp-2 min-h-[2.4em] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.colors.length > 0 && (
          <div className="flex items-center gap-1" aria-label="رنگ‌ها">
            {product.colors.slice(0, 5).map((c) => (
              <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />
            ))}
            {product.colors.length > 5 && <span className="text-[10px] text-muted-foreground num">+{formatNumber(product.colors.length - 5)}</span>}
          </div>
        )}

        <div className="flex items-end justify-between gap-2 pt-1 mt-auto">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[11px] text-muted-foreground line-through num leading-none mb-1">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
            <span className={cn("text-[13px] sm:text-[15px] font-extrabold num whitespace-nowrap", hasDiscount ? "text-accent" : "text-foreground")}>
              {formatPrice(product.price)}
            </span>
          </div>
          <button
            type="button"
            onClick={quickAdd}
            aria-label={`افزودن ${product.name} به سبد`}
            className="h-9 w-9 shrink-0 rounded-xl bg-brand-gradient text-white flex items-center justify-center shadow-md shadow-primary/25 hover:scale-110 active:scale-95 transition-transform"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {product.freeShipping && (
          <p className="text-[10px] text-emerald-600 font-semibold">ارسال رایگان</p>
        )}
      </div>
    </article>
  );
}
