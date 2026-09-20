"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice, formatNumber } from "@/lib/utils";
import Button from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDropdown({ open, onClose }: Props) {
  const { items, subtotal, isReady } = useCart();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 z-50 mt-2 w-[min(22rem,92vw)] bg-surface border border-border rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-semibold">
            سبد خرید{" "}
            {isReady && items.length > 0 && (
              <span className="text-muted-foreground font-normal num">
                ({formatNumber(items.length)})
              </span>
            )}
          </span>
        </div>
        {!isReady || items.length === 0 ? (
          <div className="p-6 text-center type-caption">سبد خرید خالی است</div>
        ) : (
          <>
            <ul className="max-h-64 overflow-y-auto divide-y divide-border">
              {items.slice(0, 4).map((item) => (
                <li key={item.id} className="flex gap-3 p-3">
                  <div className="relative h-14 w-12 shrink-0 bg-muted overflow-hidden rounded">
                    <Image src={item.image} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs line-clamp-1 font-medium">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {item.size} · {item.color} × {formatNumber(item.quantity)}
                    </p>
                    <p className="text-xs font-semibold mt-1 num" data-num>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-3 border-t border-border space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span>جمع</span>
                <span className="num" data-num>
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/cart" onClick={onClose}>
                  <Button variant="outline" size="sm" className="w-full">
                    مشاهده سبد
                  </Button>
                </Link>
                <Link href="/checkout" onClick={onClose}>
                  <Button size="sm" className="w-full">
                    تسویه
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
