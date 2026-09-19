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
      <Container className="py-24 text-center type-caption">
        در حال بارگذاری...
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-24 sm:py-32 text-center">
        <h1 className="type-headline mb-4">سبد خرید خالی است</h1>
        <p className="type-body text-muted-foreground mb-10 max-w-sm mx-auto">
          هنوز محصولی انتخاب نکرده‌اید. مجموعه را ببینید و شروع کنید.
        </p>
        <Link href="/products">
          <Button size="lg">مشاهده محصولات</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <nav className="type-caption mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          خانه
        </Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-foreground">سبد خرید</span>
      </nav>

      <h1 className="type-headline mb-10">سبد خرید</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-8">
          <hr className="rule" />
          {items.map((item) => (
            <div key={item.id}>
              <CartItem item={item} />
              <hr className="rule" />
            </div>
          ))}
        </div>
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <CartSummary />
        </div>
      </div>
    </Container>
  );
}
