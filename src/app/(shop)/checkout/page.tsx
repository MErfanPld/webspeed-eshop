"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PaymentReceiptUpload from "@/components/checkout/PaymentReceiptUpload";
import { useCart } from "@/context/CartContext";
import { formatPrice, formatNumber } from "@/lib/utils";
import { storeInfo } from "@/data/store";
import { Copy, Check, CreditCard } from "lucide-react";

type Step = "form" | "payment" | "success";

export default function CheckoutPage() {
  const { items, subtotal, clearCart, isReady } = useCart();
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
    if (!form.fullName.trim()) e.fullName = "نام الزامی است";
    if (!form.phone.trim()) e.phone = "شماره تماس الزامی است";
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

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(
        storeInfo.payment.cardNumber.replace(/-/g, "")
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receipt) {
      alert("لطفاً تصویر رسید پرداخت را آپلود کنید");
      return;
    }
    setOrderId(`WS-${Date.now().toString().slice(-8)}`);
    clearCart();
    setStep("success");
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
          سفارش شما پس از بررسی رسید پرداخت تأیید می‌شود. از طریق پیامک یا ایمیل
          از وضعیت مطلع می‌شوید.
        </p>
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
                    {formatPrice(subtotal)}
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
                      {storeInfo.payment.cardNumber}
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

              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  ثبت سفارش
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
            <div className="flex justify-between font-semibold">
              <span>جمع کل</span>
              <span className="num" data-num>
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="type-caption">ارسال رایگان · پرداخت کارت‌به‌کارت</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
