"use client";

import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/product";

type Props = {
  categories: Category[];
};

export default function CategoryMarquee({ categories }: Props) {
  const items = [...categories, ...categories];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-5 sm:gap-7 py-1">
        {items.map((cat, i) => (
          <Link
            key={`${cat.id}-${i}`}
            href={`/products?category=${cat.slug}`}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-muted ring-1 ring-border group-hover:ring-[var(--discount)] group-hover:scale-105 transition-all duration-300">
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-center max-w-[4.5rem] truncate">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
