"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { storeInfo } from "@/data/store";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "success">("idle");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eMap: Record<string, string> = {};
    if (!form.name.trim()) eMap.name = "نام الزامی است";
    if (!form.email.trim()) eMap.email = "ایمیل الزامی است";
    if (!form.message.trim()) eMap.message = "پیام الزامی است";
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;
    setStatus("success");
    setForm({ name: "", email: "", phone: "", message: "" });
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
            <div className="border border-border rounded-sm p-8 text-center">
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
                  className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                />
                {errors.message && (
                  <p className="text-xs text-red-600">{errors.message}</p>
                )}
              </div>
              <Button type="submit" size="lg">
                ارسال پیام
              </Button>
            </form>
          )}
        </div>
      </div>
    </Container>
  );
}
