"use client";

import type { PageBlock } from "@/builder/types";

type Props = { block: PageBlock };

function d(block: PageBlock): Record<string, unknown> {
  return ((block as { data?: Record<string, unknown> }).data || {}) as Record<
    string,
    unknown
  >;
}

export function ContactFormBlock({ block }: Props) {
  const data = d(block);
  const title = String(data.title ?? "تماس با ما");
  const subtitle = String(data.subtitle ?? "پیام خود را برای ما بفرستید");
  const buttonLabel = String(data.buttonLabel ?? "ارسال پیام");
  const fields = Array.isArray(data.fields)
    ? (data.fields as {
        label: string;
        name: string;
        type?: string;
        placeholder?: string;
        required?: boolean;
      }[])
    : [
        { label: "نام", name: "name", type: "text", placeholder: "نام شما", required: true },
        { label: "ایمیل", name: "email", type: "email", placeholder: "email@example.com", required: true },
        { label: "پیام", name: "message", type: "textarea", placeholder: "متن پیام...", required: true },
      ];
  return (
    <section className="w-full px-4 sm:px-6 py-12 sm:py-16" data-block="contact-form">
      <div className="mx-auto max-w-lg">
        <h2 className="text-xl font-bold text-center mb-1">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground text-center mb-8">{subtitle}</p>
        )}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {fields.map((f) => (
            <label key={f.name} className="block space-y-1.5">
              <span className="text-xs font-semibold text-foreground/80">
                {f.label}
                {f.required && <span className="text-red-500 mr-0.5">*</span>}
              </span>
              {f.type === "textarea" ? (
                <textarea
                  name={f.name}
                  required={!!f.required}
                  placeholder={f.placeholder}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#111]/10 resize-y min-h-[100px]"
                />
              ) : (
                <input
                  type={f.type || "text"}
                  name={f.name}
                  required={!!f.required}
                  placeholder={f.placeholder}
                  className="w-full h-11 px-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#111]/10"
                />
              )}
            </label>
          ))}
          <button type="submit" className="w-full h-11 rounded-xl bg-[#111] text-white text-sm font-semibold hover:bg-black">
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  );
}

export function NewsletterFormBlock({ block }: Props) {
  const data = d(block);
  return (
    <section className="w-full px-4 sm:px-6 py-10" data-block="newsletter-form">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-muted/30 p-6 sm:p-8 text-center">
        <h3 className="text-lg font-bold">{String(data.title ?? "عضویت در خبرنامه")}</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-5">
          {String(data.subtitle ?? "از جدیدترین محصولات باخبر شوید")}
        </p>
        <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input type="email" required placeholder={String(data.placeholder ?? "ایمیل شما")} className="flex-1 h-11 px-3 rounded-xl border border-border text-sm" />
          <button type="submit" className="h-11 px-5 rounded-xl bg-[#111] text-white text-sm font-semibold shrink-0">
            {String(data.buttonLabel ?? "عضویت")}
          </button>
        </form>
      </div>
    </section>
  );
}

export function LoginFormBlock({ block }: Props) {
  const data = d(block);
  return (
    <section className="w-full px-4 sm:px-6 py-12" data-block="login-form">
      <div className="mx-auto max-w-sm">
        <h2 className="text-xl font-bold text-center mb-6">{String(data.title ?? "ورود / ثبت‌نام")}</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold">شماره موبایل</span>
            <input type="tel" required placeholder={String(data.placeholder ?? "0912xxxxxxx")} className="w-full h-11 px-3 rounded-xl border border-border text-sm dir-ltr text-left" />
          </label>
          <button type="submit" className="w-full h-11 rounded-xl bg-[#111] text-white text-sm font-semibold">
            {String(data.buttonLabel ?? "دریافت کد تأیید")}
          </button>
        </form>
      </div>
    </section>
  );
}

export function SearchFormBlock({ block }: Props) {
  const data = d(block);
  return (
    <section className="w-full px-4 sm:px-6 py-8" data-block="search-form">
      <form className="mx-auto max-w-xl flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <input type="search" name="q" placeholder={String(data.placeholder ?? "جستجوی محصول...")} className="flex-1 h-11 px-4 rounded-xl border border-border text-sm" />
        <button type="submit" className="h-11 px-5 rounded-xl bg-[#111] text-white text-sm font-semibold shrink-0">
          {String(data.buttonLabel ?? "جستجو")}
        </button>
      </form>
    </section>
  );
}

export function IconListBlock({ block }: Props) {
  const data = d(block);
  const items = Array.isArray(data.items)
    ? (data.items as { title: string; text?: string }[])
    : [
        { title: "ارسال سریع", text: "۱ تا ۳ روز کاری" },
        { title: "ضمانت اصالت", text: "۱۰۰٪ اورجینال" },
        { title: "پشتیبانی", text: "همه‌روزه" },
      ];
  return (
    <section className="w-full px-4 sm:px-6 py-10" data-block="icon-list">
      <ul className="mx-auto max-w-2xl space-y-4">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="mt-0.5 h-6 w-6 rounded-full bg-[#111] text-white text-xs font-bold inline-flex items-center justify-center shrink-0">✓</span>
            <div>
              <p className="text-sm font-semibold">{it.title}</p>
              {it.text && <p className="text-xs text-muted-foreground mt-0.5">{it.text}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
