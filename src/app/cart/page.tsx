"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, isReady } = useCart();

  if (!isReady) {
    return (
      <Container className="py-20 text-center text-muted-foreground">
        در حال بارگذاری...
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">سبد خرید خالی است</h1>
        <p className="text-muted-foreground mb-8">
          هنوز محصولی به سبد اضافه نکرده‌اید.
        </p>
        <Link href="/products">
          <Button size="lg">مشاهده محصولات</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          خانه
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">سبد خرید</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
        سبد خرید
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </Container>
  );
}
