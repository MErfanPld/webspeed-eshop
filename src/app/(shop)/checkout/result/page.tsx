import Link from "next/link";
import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "نتیجه پرداخت", robots: { index: false } };

/** The payment callback (API) redirects here with ?order=&status=ok|failed */
export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; status?: string }>;
}) {
  const { order = "", status } = await searchParams;
  const ok = status === "ok";
  return (
    <Container className="py-20 sm:py-28 text-center max-w-lg">
      <div
        className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${ok ? "bg-muted" : "bg-red-50"}`}
      >
        {ok ? (
          <Check className="h-7 w-7 text-foreground" strokeWidth={1.5} />
        ) : (
          <X className="h-7 w-7 text-red-600" strokeWidth={1.5} />
        )}
      </div>
      <h1 className="type-headline mb-3" data-testid="payment-result">
        {ok ? "پرداخت موفق بود" : "پرداخت ناموفق بود"}
      </h1>
      {order && (
        <p className="type-body text-muted-foreground mb-2">
          شماره سفارش: <span className="font-medium text-foreground num">{order}</span>
        </p>
      )}
      <p className="type-body text-muted-foreground mb-10 leading-relaxed">
        {ok
          ? "سفارش شما پرداخت و تأیید شد. وضعیت ارسال را از صفحه «پیگیری سفارش» ببینید."
          : "مبلغی از حساب شما کسر نشد یا طی ۷۲ ساعت برمی‌گردد. سفارش لغو شد؛ می‌توانید دوباره خرید کنید."}
      </p>
      {ok && order && (
        <Link href={`/track?number=${encodeURIComponent(order)}`} className="block mb-3 text-sm underline underline-offset-4">
          پیگیری سفارش
        </Link>
      )}
      <Link href="/products">
        <Button size="lg">بازگشت به فروشگاه</Button>
      </Link>
    </Container>
  );
}
