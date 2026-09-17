"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartSummary() {
  const { subtotal, totalItems } = useCart();

  return (
    <div className="space-y-6">
      <h2 className="type-title">خلاصه</h2>
      <div className="space-y-3 type-body">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            جمع ({totalItems} کالا)
          </span>
          <span className="num" data-num>
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">ارسال</span>
          <span>رایگان</span>
        </div>
        <hr className="rule" />
        <div className="flex justify-between font-medium">
          <span>مجموع</span>
          <span className="num" data-num>
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>
      <Link href="/checkout" className="block">
        <Button size="lg" className="w-full">
          ادامه به تسویه
        </Button>
      </Link>
      <Link
        href="/products"
        className="block text-center type-caption hover:text-foreground transition-colors"
      >
        ادامه خرید
      </Link>
    </div>
  );
}
