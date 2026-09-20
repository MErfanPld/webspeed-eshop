"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import ProductCarousel from "@/components/home/ProductCarousel";
import CategoryMarquee from "@/components/home/CategoryMarquee";
import ProductGrid from "@/components/products/ProductGrid";
import { getFeaturedProducts, getNewArrivals, products } from "@/data/products";
import { categories } from "@/data/categories";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=70",
    eyebrow: "مجموعه جدید",
    title: "فصل تازه، استایل تازه",
    subtitle: "پوشاک مینیمال با کیفیت بالا — برای هر روز زندگی",
    cta: "مشاهده محصولات",
    href: "/products?sort=newest",
  },
  {
    image:
      "https://images.unsplash.com/photo-1490576476680-64ee07a35a7f?w=1400&q=70",
    eyebrow: "مردانه",
    title: "طراحی ساده، دوام بالا",
    subtitle: "قطعات ضروری کمد مردانه با برش دقیق",
    cta: "خرید مردانه",
    href: "/products?gender=men",
  },
  {
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1400&q=70",
    eyebrow: "زنانه",
    title: "ظرافت در جزئیات",
    subtitle: "انتخاب‌های شیک برای استایل روزمره و رسمی",
    cta: "خرید زنانه",
    href: "/products?gender=women",
  },
];

export default function HomePage() {
  const [idx, setIdx] = useState(0);
  const featured = getFeaturedProducts().slice(0, 8);
  const newest = getNewArrivals().slice(0, 10);
  const specials = products
    .filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
    .slice(0, 8);
  const cats = categories.filter((c) => c.id !== "all");

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="no-x-scroll pb-8">
      <section className="relative w-full h-[min(72vh,520px)] min-h-[280px] sm:min-h-[360px] overflow-hidden bg-foreground">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === idx ? "opacity-100 z-[1]" : "opacity-0 z-0"
            }`}
            aria-hidden={i !== idx}
          >
            <Image
              src={s.image}
              alt=""
              fill
              priority={i === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/15" />
            <div className="absolute inset-0 flex items-end sm:items-center">
              <div className="w-full max-w-content mx-auto px-5 sm:px-8 lg:px-12 pb-12 sm:pb-0">
                <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/80 mb-3">
                  {s.eyebrow}
                </p>
                <h1 className="text-[1.75rem] xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.15] max-w-lg">
                  {s.title}
                </h1>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/85 max-w-md leading-relaxed">
                  {s.subtitle}
                </p>
                <Link
                  href={s.href}
                  className="mt-5 sm:mt-7 inline-flex h-11 items-center justify-center px-6 rounded-lg bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  {s.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[2] h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-colors"
          aria-label="اسلاید قبلی"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => setIdx((i) => (i + 1) % slides.length)}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-[2] h-10 w-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-colors"
          aria-label="اسلاید بعدی"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[2] flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? "w-7 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`اسلاید ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <Container className="py-7 sm:py-9">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold">دسته‌بندی‌ها</h2>
          <Link href="/products" className="text-xs text-muted-foreground hover:text-foreground">
            همه
          </Link>
        </div>
        <CategoryMarquee categories={cats} />
      </Container>

      <Container className="pb-8 sm:pb-10">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-bold">جدیدترین محصولات</h2>
          <Link
            href="/products?sort=newest"
            className="text-xs font-medium text-[var(--discount)] hover:opacity-80"
          >
            مشاهده همه
          </Link>
        </div>
        <ProductCarousel products={newest} />
      </Container>

      {specials.length > 0 && (
        <section className="bg-[#fff5f6] py-8 sm:py-10">
          <Container>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-[var(--discount)]">
                پیشنهاد شگفت‌انگیز
              </h2>
              <Link href="/products" className="text-xs font-medium text-[var(--discount)]">
                همه تخفیف‌ها
              </Link>
            </div>
            <ProductCarousel products={specials} />
          </Container>
        </section>
      )}

      <Container className="py-8 sm:py-12">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-bold">پرفروش‌ترین‌ها</h2>
          <Link
            href="/products?sort=bestseller"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            مشاهده همه
          </Link>
        </div>
        <ProductGrid products={featured} />
      </Container>
    </div>
  );
}
