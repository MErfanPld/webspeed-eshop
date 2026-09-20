"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, formatNumber } from "@/lib/utils";
import { Truck, Tag } from "lucide-react";

const COUPONS: Record<string, number> = {
  WEBSPEED10: 0.1,
  SALE20: 0.2,
  WELCOME: 0.15,
};

export default function CartSummary() {
  const { subtotal, totalItems } = useCart();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const freeShipThreshold = 2500000;
  const discountRate = applied ? COUPONS[applied] || 0 : 0;
  const discount = Math.round(subtotal * discountRate);
  const payable = subtotal - discount;
  const remaining = Math.max(0, freeShipThreshold - payable);
  const freeShipping = remaining === 0;

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const key = code.trim().toUpperCase();
    if (!key) {
      setCouponError("کد تخفیف را وارد کنید");
      return;
    }
    if (COUPONS[key]) {
      setApplied(key);
      setCouponError("");
    } else {
      setApplied(null);
      setCouponError("کد تخفیف معتبر نیست");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-5 sticky top-28">
      <h2 className="font-semibold text-base">خلاصه سبد</h2>
      <form onSubmit={applyCoupon} className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Tag className="h-3.5 w-3.5" />
          کد تخفیف
        </label>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setCouponError("");
            }}
            placeholder="مثلاً WEBSPEED10"
            dir="ltr"
            className="flex-1 h-11 rounded-xl border border-border px-3 text-sm num bg-transparent focus:outline-none focus:border-foreground/40"
          />
          <button type="submit" className="h-11 px-4 rounded-xl border border-border text-xs font-semibold hover:bg-muted shrink-0">
            اعمال
          </button>
        </div>
        {couponError && <p className="text-[11px] text-[var(--discount)]">{couponError}</p>}
        {applied && (
          <p className="text-[11px] text-emerald-600 font-medium">
            کد {applied} اعمال شد ({Math.round(discountRate * 100)}٪ تخفیف)
          </p>
        )}
        <p className="text-[10px] text-muted-foreground">نمونه: WEBSPEED10 · SALE20 · WELCOME</p>
      </form>
      <div className="space-y-3 text-sm border-t border-border pt-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">جمع ({formatNumber(totalItems)} کالا)</span>
          <span className="num font-medium" data-num>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>تخفیف</span>
            <span className="num font-medium" data-num>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">هزینه ارسال</span>
          <span className={freeShipping ? "text-emerald-600 font-medium" : ""}>
            {freeShipping ? "رایگان" : "محاسبه در تسویه"}
          </span>
        </div>
      </div>
      <div className="rounded-xl bg-muted/70 p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <Truck className="h-3.5 w-3.5 text-muted-foreground" />
          {freeShipping ? (
            <span className="text-emerald-700 font-medium">ارسال این سفارش رایگان است</span>
          ) : (
            <span className="text-muted-foreground">{formatPrice(remaining)} تا ارسال رایگان</span>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${Math.min(100, (payable / freeShipThreshold) * 100)}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between items-baseline pt-1 border-t border-border">
        <span className="font-semibold">مبلغ قابل پرداخت</span>
        <span className="text-lg font-bold num" data-num>{formatPrice(payable)}</span>
      </div>
      <Link href="/checkout" className="flex h-12 w-full items-center justify-center rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors">
        ادامه فرآیند خرید
      </Link>
      <Link href="/products" className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
        ادامه خرید از فروشگاه
      </Link>
    </div>
  );
}
