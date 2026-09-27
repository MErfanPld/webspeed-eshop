"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroBlock as HeroBlockType, PageBlock } from "@/builder/types";
import { cn } from "@/lib/utils";

export default function HeroBlockView({ block }: { block: PageBlock }) {
  const data = (block as HeroBlockType).data;
  const slides = data.slides || [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(slides.length, 1));
  }, [slides.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % Math.max(slides.length, 1));
  }, [slides.length]);

  useEffect(() => {
    if (!data.autoplay || paused || slides.length < 2) return;
    const t = setInterval(next, data.intervalMs || 5000);
    return () => clearInterval(t);
  }, [data.autoplay, data.intervalMs, next, paused, slides.length]);

  if (!slides.length) return null;
  const slide = slides[index];

  return (
    <section
      className="relative w-full overflow-hidden bg-concrete"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative aspect-[16/10] sm:aspect-[21/9] min-h-[280px] max-h-[560px] w-full">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              i === index ? "opacity-100 z-[1]" : "opacity-0 z-0"
            )}
            aria-hidden={i !== index}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/30 to-black/10" />
          </div>
        ))}

        <div className="absolute inset-0 z-[2] flex items-center">
          <div
            className={cn(
              "mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8",
              slide.align === "center" && "text-center",
              slide.align === "left" && "text-left"
            )}
          >
            <div
              className={cn(
                "max-w-xl text-white",
                slide.align === "center" && "mx-auto",
                slide.align === "left" && "ml-auto"
              )}
            >
              {slide.eyebrow && (
                <p className="mb-3 text-xs font-medium tracking-[0.2em] uppercase text-white/80">
                  {slide.eyebrow}
                </p>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="mt-4 text-sm sm:text-base text-white/85 leading-relaxed max-w-md">
                  {slide.subtitle}
                </p>
              )}
              {slide.ctaLabel && slide.ctaHref && (
                <Link
                  href={slide.ctaHref}
                  className="mt-6 inline-flex h-12 items-center px-7 rounded-full bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  {slide.ctaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[3] h-10 w-10 rounded-full bg-white/90 text-foreground flex items-center justify-center hover:bg-white shadow-sm"
              aria-label="اسلاید قبلی"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-[3] h-10 w-10 rounded-full bg-white/90 text-foreground flex items-center justify-center hover:bg-white shadow-sm"
              aria-label="اسلاید بعدی"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[3] flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-8 bg-white" : "w-1.5 bg-white/50"
                  )}
                  aria-label={`اسلاید ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
