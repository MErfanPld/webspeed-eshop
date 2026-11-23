"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useStoreInfo } from "@/context/StoreInfoContext";
import { ApiError, api, errorMessage } from "@/lib/api/client";

export default function ContactPage() {
  const storeInfo = useStoreInfo();
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [sendError, setSendError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  // Sent to the store's inbox in the admin panel (/admin/messages)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eMap: Record<string, string> = {};
    if (!form.name.trim()) eMap.name = "نام الزامی است";
    if (!form.email.trim() && !form.phone.trim()) eMap.email = "ایمیل یا شماره تماس را وارد کنید";
    if (form.message.trim().length < 5) eMap.message = "پیام را بنویسید";
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;
    setStatus("sending");
    setSendError(null);
    try {
      await api("/contact", { method: "POST", body: form, refresh: false, redirectOnExpire: false });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("idle");
      if (err instanceof ApiError && err.details && typeof err.details === "object") setErrors(err.details as Record<string, string>);
      setSendError(errorMessage(err, "ارسال پیام ناموفق بود"));
    }
  };

  return (
    <Container className="py-8 sm:py-12">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          خانه
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">تماس با ما</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            تماس با ما
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            سوالی دارید؟ از طریق فرم زیر یا اطلاعات تماس با ما در ارتباط باشید.
          </p>

          <ul className="space-y-4 text-sm">
            <li>
              <span className="text-muted-foreground block mb-1">آدرس</span>
              <span>{storeInfo.address}</span>
            </li>
            <li>
              <span className="text-muted-foreground block mb-1">تلفن</span>
              <span dir="ltr">{storeInfo.phone}</span>
            </li>
            <li>
              <span className="text-muted-foreground block mb-1">ایمیل</span>
              <span>{storeInfo.email}</span>
            </li>
            <li>
              <span className="text-muted-foreground block mb-1">
                ساعات کاری
              </span>
              <span>{storeInfo.workingHours}</span>
            </li>
          </ul>
        </div>

        <div>
          {status === "success" ? (
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8 text-center" role="status">
              <p className="text-lg font-medium mb-2">پیام شما ارسال شد</p>
              <p className="text-sm text-muted-foreground mb-6">
                در اسرع وقت با شما تماس می‌گیریم.
              </p>
              <Button variant="outline" onClick={() => setStatus("idle")}>
                ارسال پیام جدید
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="name"
                label="نام"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                error={errors.name}
              />
              <Input
                id="email"
                label="ایمیل"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                error={errors.email}
              />
              <Input
                id="phone"
                label="شماره تماس (اختیاری)"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium"
                >
                  پیام
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-7 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                />
                {errors.message && (
                  <p className="text-xs text-red-600">{errors.message}</p>
                )}
              </div>
              {sendError && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{sendError}</p>}
              <Button type="submit" size="lg" disabled={status === "sending"}>
                {status === "sending" ? "در حال ارسال..." : "ارسال پیام"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Container>
  );
}
