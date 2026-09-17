"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

const SHIPPING = 0;

export default function CartSummary() {
  const { subtotal, totalItems } = useCart();
  const total = subtotal + SHIPPING;

  return (
    <div className="border border-border rounded-sm p-6 space-y-4 sticky top-24">
      <h2 className="text-lg font-semibold">خلاصه سفارش</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            جمع ({totalItems} کالا)
          </span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">هزینه ارسال</span>
          <span>{SHIPPING === 0 ? "رایگان" : formatPrice(SHIPPING)}</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-border font-semibold text-base">
          <span>مجموع</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <Link href="/checkout" className="block">
        <Button size="lg" className="w-full">
          ادامه به تسویه
        </Button>
      </Link>
      <Link
        href="/products"
        className="block text-center text-sm text-muted-foreground hover:text-foreground"
      >
        ادامه خرید
      </Link>
    </div>
  );
}
