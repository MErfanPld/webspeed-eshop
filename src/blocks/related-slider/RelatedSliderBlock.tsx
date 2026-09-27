"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
  RelatedSliderBlock as RelatedSliderBlockType,
  PageBlock,
} from "@/builder/types";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import { resolveProducts } from "@/lib/products-query";

export default function RelatedSliderBlockView({
  block,
}: {
  block: PageBlock;
}) {
  const data = (block as RelatedSliderBlockType).data;
  const list = resolveProducts({
    productIds: data.productIds,
    limit: 12,
  });
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth * 0.75 * dir, behavior: "smooth" });
  };

  if (!list.length) return null;

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {data.title}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-muted"
              aria-label="قبلی"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-muted"
              aria-label="بعدی"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          ref={scroller}
          className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {list.map((p) => (
            <div
              key={p.id}
              className="min-w-[46%] sm:min-w-[30%] lg:min-w-[22%] snap-start"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
