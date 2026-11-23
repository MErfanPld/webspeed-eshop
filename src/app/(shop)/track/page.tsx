"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatNumber, formatPrice } from "@/lib/utils";
import { api, errorMessage } from "@/lib/api/client";

type Tracked = {
  number: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  shipping: number;
  createdAt: string;
  items: { name: string; quantity: number; size: string; color: string; lineTotal: number }[];
};

const STATUS_FA: Record<Tracked["status"], string> = {
  pending: "در انتظار بررسی پرداخت",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
};

const STEPS: Tracked["status"][] = ["pending", "confirmed", "shipped", "delivered"];

export default function TrackOrderPage() {
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Tracked | null>(null);

  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("number");
    if (n) setNumber(n);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const body = await api<{ order: Tracked }>(
        `/orders/track?number=${encodeURIComponent(number)}&phone=${encodeURIComponent(phone)}`,
        { refresh: false, redirectOnExpire: false }
      );
      setOrder(body.order);
    } catch (e) {
      setError(errorMessage(e, "سفارش یافت نشد"));
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = order ? STEPS.indexOf(order.status) : -1;

  return (
    <Container className="py-12 sm:py-16 max-w-xl">
      <h1 className="type-headline mb-2">پیگیری سفارش</h1>
      <p className="type-caption mb-8">شماره سفارش و موبایلی که هنگام خرید وارد کردید را بنویسید.</p>
      <form onSubmit={submit} className="space-y-4">
        <Input id="number" label="شماره سفارش" value={number} onChange={(e) => setNumber(e.target.value)} dir="ltr" placeholder="WS-..." />
        <Input id="phone" label="شماره موبایل" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" placeholder="09121234567" />
        <Button type="submit" size="lg" disabled={loading || !number || !phone}>
          {loading ? "در حال جستجو..." : "پیگیری"}
        </Button>
      </form>

      {error && (
        <p role="alert" className="mt-6 text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">
          {error}
        </p>
      )}

      {order && (
        <section className="mt-8 border border-border/70 rounded-3xl bg-surface shadow-[0_1px_2px_rgba(30,27,46,0.04)] p-6 space-y-5" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold num" dir="ltr">{order.number}</p>
            <span className="text-xs font-semibold px-2.5 py-1 bg-muted">{STATUS_FA[order.status]}</span>
          </div>
          {order.status !== "cancelled" && (
            <ol className="grid grid-cols-4 gap-2">
              {STEPS.map((s, i) => (
                <li key={s} className="space-y-1.5">
                  <span className={`block h-1 ${i <= stepIndex ? "bg-foreground" : "bg-border"}`} />
                  <span className="block text-[10px] text-muted-foreground">{STATUS_FA[s]}</span>
                </li>
              ))}
            </ol>
          )}
          <ul className="space-y-2 text-sm">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span>
                  {it.name} · {it.size} · {it.color} × {formatNumber(it.quantity)}
                </span>
                <span className="num shrink-0">{formatPrice(it.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold border-t border-border pt-3">
            <span>مبلغ کل</span>
            <span className="num">{formatPrice(order.total)}</span>
          </div>
        </section>
      )}
    </Container>
  );
}
