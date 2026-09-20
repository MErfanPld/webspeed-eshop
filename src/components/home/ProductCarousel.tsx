"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";

type Props = {
  products: Product[];
};

export default function ProductCarousel({ products }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.75, 320);
    el.scrollBy({ left: dir * -amount, behavior: "smooth" });
  };

  return (
    <div className="relative group/carousel">
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-surface border border-border shadow-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden sm:flex"
        aria-label="قبلی"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-surface border border-border shadow-md flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden sm:flex"
        aria-label="بعدی"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={ref}
        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-2 -mx-1 px-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p, i) => (
          <div
            key={p.id}
            className="min-w-[42%] xs:min-w-[38%] sm:min-w-[28%] md:min-w-[22%] lg:min-w-[18%] snap-start"
          >
            <ProductCard product={p} priority={i < 3} />
          </div>
        ))}
      </div>
    </div>
  );
}
