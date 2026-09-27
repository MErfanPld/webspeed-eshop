"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {
  ProductSliderBlock as ProductSliderBlockType,
  PageBlock,
} from "@/builder/types";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import { resolveProducts } from "@/lib/products-query";

export default function ProductSliderBlockView({
  block,
}: {
  block: PageBlock;
}) {
  const data = (block as ProductSliderBlockType).data;
  const list = resolveProducts({
    productIds: data.productIds,
    source: data.source,
    limit: data.limit ?? 8,
  });
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75 * dir;
    el.scrollBy({ left: -amount, behavior: "smooth" });
  };

  if (!list.length) return null;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{data.subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {data.viewAllHref && (
              <Link
                href={data.viewAllHref}
                className="hidden sm:inline text-xs font-medium text-muted-foreground hover:text-foreground ml-2"
              >
                مشاهده همه
              </Link>
            )}
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
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {list.map((product, i) => (
            <div
              key={product.id}
              className="min-w-[46%] sm:min-w-[32%] lg:min-w-[23%] snap-start"
            >
              <ProductCard product={product} priority={i < 2} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
