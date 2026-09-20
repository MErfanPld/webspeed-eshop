"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function CartPage() {
  const { items, totalItems, isReady } = useCart();

  if (!isReady) {
    return (
      <Container className="py-20 text-center text-sm text-muted-foreground">
        در حال بارگذاری سبد...
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="max-w-sm mx-auto text-center space-y-5">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-bold">سبد خرید خالی است</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            هنوز محصولی اضافه نکرده‌اید. از فروشگاه دیدن کنید و شروع کنید.
          </p>
          <Link
            href="/products"
            className="inline-flex h-11 items-center px-6 rounded-xl bg-foreground text-background text-sm font-semibold"
          >
            مشاهده محصولات
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-10">
      <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "سبد خرید" }]} />
      <div className="flex items-baseline justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">سبد خرید</h1>
        <span className="text-xs text-muted-foreground num" data-num>
          {formatNumber(totalItems)} کالا
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <CartSummary />
        </div>
      </div>
    </Container>
  );
}
