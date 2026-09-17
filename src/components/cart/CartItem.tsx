"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/types/cart";
import { formatPrice } from "@/lib/utils";
import QuantitySelector from "@/components/products/QuantitySelector";
import { useCart } from "@/context/CartContext";

type Props = {
  item: CartItemType;
};

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-6 border-b border-border">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-28 w-24 shrink-0 overflow-hidden bg-muted"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/products/${item.slug}`}
            className="text-sm font-medium hover:underline line-clamp-1"
          >
            {item.name}
          </Link>
          <p className="text-xs text-muted-foreground mt-1">
            سایز: {item.size} · رنگ: {item.color}
          </p>
          <p className="text-sm font-semibold mt-2">
            {formatPrice(item.price)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(q) => updateQuantity(item.id, q)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label="حذف از سبد"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
