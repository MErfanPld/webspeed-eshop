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
      className="relative w-full overflow-hidden bg-brand-gradient"
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
              className={cn("object-cover", i === index && "ws-kenburns")}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-0 z-[2] flex items-center">
          <div
            className={cn(
              // side padding keeps the text clear of the arrow buttons
              "mx-auto w-full max-w-content px-14 sm:px-20 lg:px-24",
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
                <p key={`e${index}`} className="ws-rise mb-4 inline-flex items-center rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/30">
                  {slide.eyebrow}
                </p>
              )}
              <h1 key={`t${index}`} className="ws-rise ws-rise-2 text-3xl sm:text-4xl lg:text-[3.4rem] font-extrabold leading-[1.2] tracking-tight drop-shadow-sm">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p key={`s${index}`} className="ws-rise ws-rise-3 mt-4 text-sm sm:text-lg text-white/90 leading-relaxed max-w-md">
                  {slide.subtitle}
                </p>
              )}
              {slide.ctaLabel && slide.ctaHref && (
                <Link
                  key={`c${index}`}
                  href={slide.ctaHref}
                  className="ws-rise ws-rise-4 ws-shine mt-7 inline-flex h-12 sm:h-14 items-center gap-2 px-8 rounded-2xl bg-white text-primary text-sm sm:text-base font-extrabold shadow-xl shadow-black/10 hover:-translate-y-0.5 transition-transform"
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
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[3] h-11 w-11 rounded-full bg-white/20 backdrop-blur text-white ring-1 ring-white/40 flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
              aria-label="اسلاید قبلی"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-[3] h-11 w-11 rounded-full bg-white/20 backdrop-blur text-white ring-1 ring-white/40 flex items-center justify-center hover:bg-white hover:text-primary transition-colors"
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
