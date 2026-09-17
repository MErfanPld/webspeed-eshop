"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PaymentReceiptUpload from "@/components/checkout/PaymentReceiptUpload";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { storeInfo } from "@/data/store";

type Step = "form" | "payment" | "success";

export default function CheckoutPage() {
  const { items, subtotal, clearCart, isReady } = useCart();
  const [step, setStep] = useState<Step>("form");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
  });

  if (!isReady) {
    return (
      <Container className="py-20 text-center text-muted-foreground">
        در حال بارگذاری...
      </Container>
    );
  }

  if (items.length === 0 && step !== "success") {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">سبد خرید خالی است</h1>
        <Link href="/products">
          <Button size="lg">بازگشت به فروشگاه</Button>
        </Link>
      </Container>
    );
  }

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "نام الزامی است";
    if (!form.phone.trim()) e.phone = "شماره تماس الزامی است";
    if (!form.email.trim()) e.email = "ایمیل الزامی است";
    if (!form.province.trim()) e.province = "استان الزامی است";
    if (!form.city.trim()) e.city = "شهر الزامی است";
    if (!form.address.trim()) e.address = "آدرس الزامی است";
    if (!form.postalCode.trim()) e.postalCode = "کد پستی الزامی است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receipt) {
      alert("لطفاً تصویر رسید پرداخت را آپلود کنید");
      return;
    }
    clearCart();
    setStep("success");
  };

  if (step === "success") {
    return (
      <Container className="py-20 text-center max-w-lg">
        <div className="text-4xl mb-4">✓</div>
        <h1 className="text-2xl font-semibold mb-3">سفارش ثبت شد</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          سفارش شما پس از بررسی رسید پرداخت تأیید خواهد شد. از طریق پیامک یا
          ایمیل از وضعیت سفارش مطلع می‌شوید.
        </p>
        <Link href="/products">
          <Button size="lg">بازگشت به فروشگاه</Button>
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
        <Link href="/cart" className="hover:text-foreground">
          سبد خرید
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">تسویه حساب</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-8">
        تسویه حساب
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <section>
                <h2 className="text-lg font-semibold mb-4">اطلاعات گیرنده</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="fullName" label="نام و نام خانوادگی" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} error={errors.fullName} />
                  <Input id="phone" label="شماره تماس" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} error={errors.phone} />
                  <Input id="email" label="ایمیل" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email} className="sm:col-span-2" />
                </div>
              </section>
              <section>
                <h2 className="text-lg font-semibold mb-4">آدرس</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="province" label="استان" value={form.province} onChange={(e) => update("province", e.target.value)} error={errors.province} />
                  <Input id="city" label="شهر" value={form.city} onChange={(e) => update("city", e.target.value)} error={errors.city} />
                  <Input id="address" label="آدرس کامل" value={form.address} onChange={(e) => update("address", e.target.value)} error={errors.address} className="sm:col-span-2" />
                  <Input id="postalCode" label="کد پستی" value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} error={errors.postalCode} />
                </div>
              </section>
              <Button type="submit" size="lg">ادامه به پرداخت</Button>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <section className="border border-border rounded-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold">پرداخت کارت‌به‌کارت</h2>
                <p className="text-sm text-muted-foreground">
                  مبلغ قابل پرداخت را به شماره کارت زیر واریز کنید و تصویر رسید را آپلود نمایید.
                </p>
                <div className="bg-muted/50 rounded-sm p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">شماره کارت</span>
                    <span className="font-mono font-medium tracking-wider" dir="ltr">{storeInfo.payment.cardNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">نام صاحب کارت</span>
                    <span className="font-medium">{storeInfo.payment.cardHolder}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">مبلغ</span>
                    <span className="font-semibold text-base">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <PaymentReceiptUpload onFileChange={setReceipt} />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  سفارش شما پس از بررسی رسید پرداخت تأیید خواهد شد.
                </p>
              </section>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep("form")}>بازگشت</Button>
                <Button type="submit" size="lg">ثبت سفارش</Button>
              </div>
            </form>
          )}
        </div>

        <div>
          <div className="border border-border rounded-sm p-6 space-y-3 sticky top-24">
            <h2 className="text-lg font-semibold">خلاصه سفارش</h2>
            <ul className="space-y-2 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span className="text-muted-foreground truncate">{item.name} × {item.quantity}</span>
                  <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-3 border-t border-border font-semibold">
              <span>مجموع</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
