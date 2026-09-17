"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type NewsletterProps = {
  compact?: boolean;
};

export default function Newsletter({ compact }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("success");
    setEmail("");
  };

  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">خبرنامه</p>
          <p className="text-sm text-muted-foreground">
            از مجموعه‌های جدید باخبر شوید
          </p>
        </div>
        {status === "success" ? (
          <p className="text-sm text-foreground">با تشکر، ثبت شد.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
            <Input
              type="email"
              placeholder="ایمیل شما"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-[200px]"
              required
            />
            <Button type="submit" size="md">
              عضویت
            </Button>
          </form>
        )}
      </div>
    );
  }

  return (
    <section className="bg-muted/50 py-16">
      <div className="mx-auto max-w-xl px-4 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">خبرنامه</h2>
        <p className="mt-2 text-muted-foreground text-sm">
          برای دریافت اخبار مجموعه‌های جدید و پیشنهادهای ویژه عضو شوید.
        </p>
        {status === "success" ? (
          <p className="mt-6 text-foreground">با تشکر، ایمیل شما ثبت شد.</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            <Input
              type="email"
              placeholder="ایمیل شما"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" size="md" className="sm:w-auto w-full">
              عضویت
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
