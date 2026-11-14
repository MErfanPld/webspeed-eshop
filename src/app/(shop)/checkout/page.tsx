"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PaymentReceiptUpload from "@/components/checkout/PaymentReceiptUpload";
import { useCart } from "@/context/CartContext";
import { formatPrice, formatNumber } from "@/lib/utils";
import { useStoreInfo } from "@/context/StoreInfoContext";
import { ApiError, api, errorMessage } from "@/lib/api/client";
import { Copy, Check, CreditCard } from "lucide-react";

type Step = "form" | "payment" | "success";

export default function CheckoutPage() {
  const { items, subtotal, clearCart, isReady } = useCart();
  const storeInfo = useStoreInfo();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placedTotal, setPlacedTotal] = useState(0);
  const flatRate = Number(storeInfo.shipping.flatRate ?? 0);
  const freeOver = Number(storeInfo.shipping.freeOver ?? 0);
  const shipping = freeOver > 0 && subtotal >= freeOver ? 0 : flatRate;
  const total = subtotal + shipping;
  const [step, setStep] = useState<Step>("form");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState("");
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
      <Container className="py-20 text-center type-caption">
        در حال بارگذاری...
      </Container>
    );
  }

  if (items.length === 0 && step !== "success") {
    return (
      <Container className="py-20 text-center">
        <h1 className="type-headline mb-4">سبد خرید خالی است</h1>
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
    const digits = (v: string) => v.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[\s-]/g, "");
    if (!form.fullName.trim()) e.fullName = "نام الزامی است";
    if (!/^09\d{9}$/.test(digits(form.phone))) e.phone = "شماره موبایل معتبر نیست (مثال: 09121234567)";
    if (!form.province.trim()) e.province = "استان الزامی است";
    if (!form.city.trim()) e.city = "شهر الزامی است";
    if (!form.address.trim()) e.address = "آدرس الزامی است";
    if (!/^\d{10}$/.test(digits(form.postalCode))) e.postalCode = "کد پستی باید ۱۰ رقم باشد";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep("payment");
  };

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(
        (storeInfo.payment.cardNumber || "").replace(/[-\s]/g, "")
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!receipt) {
      setSubmitError("لطفاً تصویر رسید پرداخت را آپلود کنید");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      fd.append(
        "data",
        JSON.stringify({
          customer: form,
          items: items.map((i) => ({ productId: i.productId, size: i.size, color: i.color, quantity: i.quantity })),
        })
      );
      fd.append("receipt", receipt);
      const body = await api<{ order: { number: string; total: number } }>("/orders", {
        method: "POST",
        body: fd,
        refresh: false,
        redirectOnExpire: false,
      });
      setOrderId(body.order.number);
      setPlacedTotal(body.order.total);
      clearCart();
      setStep("success");
    } catch (e) {
      if (e instanceof ApiError && e.details && typeof e.details === "object" && !Array.isArray(e.details)) {
        const details = e.details as Record<string, unknown>;
        if (Object.values(details).every((v) => typeof v === "string")) {
          setErrors(details as Record<string, string>);
          setStep("form");
        }
      }
      setSubmitError(errorMessage(e, "ثبت سفارش ناموفق بود"));
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <Container className="py-20 sm:py-28 text-center max-w-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Check className="h-7 w-7 text-foreground" strokeWidth={1.5} />
        </div>
        <h1 className="type-headline mb-3">سفارش ثبت شد</h1>
        <p className="type-body text-muted-foreground mb-2">
          شماره سفارش:{" "}
          <span className="font-medium text-foreground num" data-num>
            {orderId}
          </span>
        </p>
        <p className="type-body text-muted-foreground mb-10 leading-relaxed">
          سفارش شما به مبلغ <span className="num">{formatPrice(placedTotal)}</span> ثبت شد و پس از بررسی رسید
          پرداخت تأیید می‌شود. وضعیت سفارش را با شماره سفارش و موبایل از صفحه «پیگیری سفارش» ببینید.
        </p>
        <Link href={`/track?number=${encodeURIComponent(orderId)}`} className="block mb-3 text-sm underline underline-offset-4">
          پیگیری سفارش
        </Link>
        <Link href="/products">
          <Button size="lg">بازگشت به فروشگاه</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <nav className="type-caption mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          خانه
        </Link>
        <span className="mx-2 text-border">/</span>
        <Link href="/cart" className="hover:text-foreground transition-colors">
          سبد خرید
        </Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-foreground">تسویه حساب</span>
      </nav>

      <h1 className="type-headline mb-2">تسویه حساب</h1>
      <p className="type-caption mb-8">
        {step === "form"
          ? "مرحله ۱ از ۲ — اطلاعات گیرنده"
          : "مرحله ۲ از ۲ — پرداخت کارت‌به‌کارت"}
      </p>

      <div className="flex items-center gap-3 mb-10">
        <div
          className={`h-1 flex-1 ${
            step === "form" || step === "payment" ? "bg-foreground" : "bg-border"
          }`}
        />
        <div
          className={`h-1 flex-1 ${step === "payment" ? "bg-foreground" : "bg-border"}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-7">
          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="fullName"
                  label="نام و نام خانوادگی"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  error={errors.fullName}
                />
                <Input
                  id="phone"
                  label="شماره موبایل"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  error={errors.phone}
                  className="num"
                  dir="ltr"
                />
              </div>
              <Input
                id="email"
                label="ایمیل (اختیاری)"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
                dir="ltr"
                className="num"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="province"
                  label="استان"
                  value={form.province}
                  onChange={(e) => update("province", e.target.value)}
                  error={errors.province}
                />
                <Input
                  id="city"
                  label="شهر"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  error={errors.city}
                />
              </div>
              <Input
                id="address"
                label="آدرس کامل"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                error={errors.address}
              />
              <Input
                id="postalCode"
                label="کد پستی"
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                error={errors.postalCode}
                className="num"
                dir="ltr"
              />
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                ادامه به پرداخت کارت‌به‌کارت
              </Button>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit} className="space-y-8">
              <div className="surface border border-border p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5" strokeWidth={1.5} />
                  <h2 className="type-title">پرداخت کارت‌به‌کارت</h2>
                </div>
                <p className="type-body text-muted-foreground leading-relaxed">
                  مبلغ{" "}
                  <strong className="text-foreground num" data-num>
                    {formatPrice(total)}
                  </strong>{" "}
                  را به شماره کارت زیر واریز کنید، سپس تصویر رسید را آپلود نمایید.
                </p>

                <div className="bg-muted p-5 space-y-3">
                  <p className="type-label text-muted-foreground">شماره کارت</p>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p
                      className="text-lg sm:text-xl font-semibold tracking-wider num"
                      dir="ltr"
                      data-num
                    >
                      {storeInfo.payment.cardNumber || "—"}
                    </p>
                    <button
                      type="button"
                      onClick={copyCard}
                      className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 bg-background hover:opacity-80 transition-opacity"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" /> کپی شد
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" /> کپی
                        </>
                      )}
                    </button>
                  </div>
                  <p className="type-caption">
                    به نام: {storeInfo.payment.cardHolder}
                  </p>
                </div>

                <ul className="space-y-2 type-caption list-disc list-inside">
                  <li>دقیقاً مبلغ سفارش را واریز کنید</li>
                  <li>رسید باید واضح و خوانا باشد</li>
                  <li>پس از بررسی، سفارش تأیید می‌شود</li>
                </ul>
              </div>

              <PaymentReceiptUpload onFileChange={setReceipt} />

              {submitError && (
                <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3">
                  {submitError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
                  {submitting ? "در حال ثبت..." : "ثبت سفارش"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep("form")}
                >
                  بازگشت
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 space-y-5 border border-border p-6">
            <h2 className="type-title">خلاصه سفارش</h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-3 type-caption"
                >
                  <span className="line-clamp-1">
                    {item.name} × {formatNumber(item.quantity)}
                  </span>
                  <span className="num shrink-0" data-num>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <hr className="rule" />
            <div className="flex justify-between type-caption">
              <span>جمع اقلام</span>
              <span className="num" data-num>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between type-caption">
              <span>هزینه ارسال</span>
              <span className="num" data-num>{shipping ? formatPrice(shipping) : "رایگان"}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>مبلغ قابل پرداخت</span>
              <span className="num" data-num>
                {formatPrice(total)}
              </span>
            </div>
            <p className="type-caption">
              پرداخت کارت‌به‌کارت · مبلغ نهایی در سرور بر اساس قیمت‌های فعلی محاسبه می‌شود
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
