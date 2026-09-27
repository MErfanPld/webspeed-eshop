"use client";

import Link from "next/link";
import type { PageBlock } from "@/builder/types";

type Props = { block: PageBlock };

export function FooterBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const brand = String(d.brand ?? "WebSpeed");
  const description = String(
    d.description ?? "فروشگاه اینترنتی پوشاک مینیمال و مدرن."
  );
  const columns = Array.isArray(d.columns)
    ? (d.columns as { title: string; links: { label: string; href: string }[] }[])
    : [
        {
          title: "فروشگاه",
          links: [
            { label: "همه محصولات", href: "/products" },
            { label: "مردانه", href: "/products?gender=men" },
            { label: "زنانه", href: "/products?gender=women" },
          ],
        },
        {
          title: "پشتیبانی",
          links: [
            { label: "تماس با ما", href: "/contact" },
            { label: "درباره ما", href: "/about" },
          ],
        },
      ];
  const copyright = String(
    d.copyright ?? "© 2026 WebSpeed. تمامی حقوق محفوظ است."
  );

  return (
    <footer className="w-full border-t border-border bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <p className="text-base font-bold">{brand}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold mb-3">{col.title}</p>
              <ul className="space-y-2">
                {(col.links || []).map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          {copyright}
        </div>
      </div>
    </footer>
  );
}

export function RichTextBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const title = d.title ? String(d.title) : null;
  const body = String(d.body ?? "");
  const align = String(d.align ?? "right") as "right" | "center" | "left";
  return (
    <div className="w-full px-4 sm:px-6 py-8 max-w-3xl mx-auto" style={{ textAlign: align }}>
      {title && <h2 className="text-xl sm:text-2xl font-bold mb-3">{title}</h2>}
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  );
}

export function ImageBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const src = String(d.src ?? "/placeholders/samsung-banner.webp");
  const alt = String(d.alt ?? "");
  const radius = Number(d.radius ?? 12);
  return (
    <div className="w-full px-4 sm:px-6 py-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-auto object-cover max-h-[480px]" style={{ borderRadius: radius }} />
    </div>
  );
}

export function TrustBadgesBlock({ block }: Props) {
  const d = (block as { data: Record<string, unknown> }).data || {};
  const items = Array.isArray(d.items)
    ? (d.items as { title: string; description?: string }[])
    : [
        { title: "ارسال سریع", description: "۲ تا ۴ روز کاری" },
        { title: "ضمانت اصالت", description: "کالای اصل" },
        { title: "پشتیبانی", description: "۷ روز هفته" },
      ];
  return (
    <div className="w-full border-y border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {items.map((item, i) => (
          <div key={i}>
            <p className="text-sm font-semibold">{item.title}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            )}
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
      <p className="text-5xl font-bold mb-3">{String(d.code ?? "۴۰۴")}</p>
      <p className="text-base text-muted-foreground mb-6">
        {String(d.message ?? "صفحه مورد نظر یافت نشد.")}
      </p>
      <Link
        href={String(d.ctaHref ?? "/")}
        className="inline-flex h-11 px-5 rounded-xl bg-foreground text-background text-sm font-semibold items-center"
      >
        {String(d.ctaLabel ?? "بازگشت به خانه")}
      </Link>
    </div>
  );
}
