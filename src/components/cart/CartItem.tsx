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
    <div className="flex gap-4 py-6">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-28 w-20 sm:h-32 sm:w-24 shrink-0 overflow-hidden bg-muted"
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
            className="type-body font-medium hover:opacity-70 line-clamp-1"
          >
            {item.name}
          </Link>
          <p className="type-caption mt-1">
            {item.size} · {item.color}
          </p>
          <p className="type-body font-medium mt-2 num" data-num>
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
            className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="حذف از سبد"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
