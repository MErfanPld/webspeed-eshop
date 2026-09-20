"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import type { CartItem as CartItemType } from "@/types/cart";
import { formatPrice, formatNumber } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

type Props = { item: CartItemType };

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3 sm:gap-5 p-3 sm:p-4 rounded-2xl border border-border bg-surface hover:border-foreground/15 transition-colors">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-24 w-20 sm:h-28 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-[#f3f1ef]"
      >
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/products/${item.slug}`} className="text-sm font-medium line-clamp-2 hover:opacity-70 leading-snug">
              {item.name}
            </Link>
            <p className="text-[11px] text-muted-foreground mt-1">{item.size} · {item.color}</p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-muted-foreground hover:text-[var(--discount)] hover:bg-muted transition-colors"
            aria-label="حذف از سبد"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3 mt-3">
          <div className="inline-flex items-center h-9 rounded-full border border-border overflow-hidden">
            <button type="button" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="h-9 w-9 flex items-center justify-center hover:bg-muted" aria-label="کاهش">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium num" data-num>{formatNumber(item.quantity)}</span>
            <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-9 w-9 flex items-center justify-center hover:bg-muted" aria-label="افزایش">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm font-semibold num" data-num>{formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
    </div>
  );
}
