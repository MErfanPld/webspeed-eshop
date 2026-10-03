"use client";

import Link from "next/link";
import type { PageBlock } from "@/builder/types";

type Props = { block: PageBlock };
type FooterCol = { title?: string; links?: { label: string; href: string }[] };

export function FooterBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const brand = String(d.brand ?? "WebSpeed");
  const description = String(d.description ?? "فروشگاه اینترنتی پوشاک مینیمال و مدرن.");
  const copyright = String(d.copyright ?? "© 2026 WebSpeed. تمامی حقوق محفوظ است.");
  const phone = String(d.phone ?? "");
  const email = String(d.email ?? "");
  const address = String(d.address ?? "");
  const showNewsletter = d.showNewsletter !== false;
  const newsletterTitle = String(d.newsletterTitle ?? "عضویت در خبرنامه");
  const newsletterPlaceholder = String(d.newsletterPlaceholder ?? "ایمیل شما");
  const bg = String(d.background ?? "#0f172a");
  const textColor = String(d.textColor ?? "#f8fafc");
  const columns = Array.isArray(d.columns)
    ? (d.columns as FooterCol[])
    : [
        {
          title: "فروشگاه",
          links: [
            { label: "همه محصولات", href: "/products" },
            { label: "مردانه", href: "/products?gender=men" },
          ],
        },
        {
          title: "پشتیبانی",
          links: [
            { label: "تماس", href: "/contact" },
            { label: "درباره", href: "/about" },
          ],
        },
      ];
  const socials = Array.isArray(d.socials)
    ? (d.socials as { label: string; href: string }[])
    : [
        { label: "اینستاگرام", href: "#" },
        { label: "تلگرام", href: "#" },
      ];

  return (
    <footer className="w-full" style={{ background: bg, color: textColor }} data-block="footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-4">
            <p className="text-lg font-bold">{brand}</p>
            <p className="text-sm opacity-70 leading-relaxed max-w-sm">{description}</p>
            {(phone || email || address) && (
              <ul className="text-sm opacity-80 space-y-1.5">
                {address && <li>{address}</li>}
                {phone && <li dir="ltr" className="text-right">{phone}</li>}
                {email && <li dir="ltr" className="text-right">{email}</li>}
              </ul>
            )}
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-1">
                {socials.map((s) => (
                  <Link key={s.label + s.href} href={s.href} className="text-xs font-medium opacity-70 hover:opacity-100 underline-offset-4 hover:underline">
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {columns.map((col, i) => (
            <div key={i} className="lg:col-span-2 space-y-3">
              {col.title && <p className="text-sm font-semibold">{col.title}</p>}
              <ul className="space-y-2">
                {(col.links || []).map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {showNewsletter && (
            <div className="lg:col-span-2 space-y-3">
              <p className="text-sm font-semibold">{newsletterTitle}</p>
              <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder={newsletterPlaceholder} className="h-10 px-3 rounded-lg text-sm bg-white/10 border border-white/15 placeholder:text-white/40 focus:outline-none" />
                <button type="submit" className="h-10 rounded-lg bg-white text-[#0f172a] text-sm font-semibold">عضویت</button>
              </form>
            </div>
          )}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-xs opacity-60 text-center sm:text-right">{copyright}</div>
      </div>
    </footer>
  );
}

export function RichTextBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const body = String(d.body ?? d.text ?? "");
  return (
    <div className="w-full px-4 sm:px-6 py-8 max-w-3xl mx-auto">
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  );
}

export function ImageBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const src = String(d.src ?? "/placeholders/samsung-banner.webp");
  const alt = String(d.alt ?? "");
  return (
    <div className="w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-auto object-cover" />
    </div>
  );
}

export function TrustBadgesBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const items = Array.isArray(d.items)
    ? (d.items as { title: string; description?: string }[])
    : [
        { title: "ارسال سریع", description: "۲ تا ۴ روز" },
        { title: "ضمانت اصالت", description: "کالای اصل" },
        { title: "پشتیبانی", description: "۷ روز هفته" },
      ];
  return (
    <div className="w-full border-y border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {items.map((item, i) => (
          <div key={i}>
            <p className="text-sm font-semibold">{item.title}</p>
            {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BreadcrumbsBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const items = Array.isArray(d.items)
    ? (d.items as { label: string; href?: string }[])
    : [
        { label: "خانه", href: "/" },
        { label: "محصولات", href: "/products" },
      ];
  return (
    <nav className="w-full px-4 sm:px-6 py-3 text-xs text-muted-foreground" aria-label="مسیر">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="inline-flex items-center gap-1.5">
            {i > 0 && <span>/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">{item.label}</Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function NotFoundBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  return (
    <div className="w-full px-4 py-20 text-center">
      <p className="text-5xl font-bold mb-3">{String(d.code ?? "404")}</p>
      <p className="text-base text-muted-foreground mb-6">{String(d.message ?? "صفحه یافت نشد.")}</p>
      <Link href={String(d.ctaHref ?? "/")} className="inline-flex h-11 px-5 rounded-xl bg-foreground text-background text-sm font-semibold items-center">
        {String(d.ctaLabel ?? "بازگشت به خانه")}
      </Link>
    </div>
  );
}
