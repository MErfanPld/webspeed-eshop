"use client";

import { useEffect, useState } from "react";
import type {
  FlashSaleBlock as FlashSaleBlockType,
  PageBlock,
} from "@/builder/types";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import { resolveProducts } from "@/lib/products-query";
import { formatNumber } from "@/lib/utils";

function useCountdown(endsAt: string) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(endsAt).getTime() - Date.now());
      const s = Math.floor(diff / 1000);
      setLeft({
        d: Math.floor(s / 86400),
        h: Math.floor((s % 86400) / 3600),
        m: Math.floor((s % 3600) / 60),
        s: s % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return left;
}

export default function FlashSaleBlockView({ block }: { block: PageBlock }) {
  const data = (block as FlashSaleBlockType).data;
  const list = resolveProducts({
    productIds: data.productIds,
    source: "featured",
    limit: data.limit ?? 6,
  });
  const t = useCountdown(data.endsAt);

  if (!list.length) return null;

  const unit = (n: number, label: string) => (
    <div className="flex flex-col items-center min-w-[3rem]">
      <span className="text-lg sm:text-xl font-bold num tabular-nums">
        {formatNumber(n).padStart(2, "۰")}
      </span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );

  return (
    <section className="py-12 sm:py-16 bg-muted/40">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {data.title}
          </h2>
          <div className="flex items-center gap-3 rounded-2xl bg-surface border border-border px-4 py-2.5">
            {unit(t.d, "روز")}
            <span className="text-muted-foreground">:</span>
            {unit(t.h, "ساعت")}
            <span className="text-muted-foreground">:</span>
            {unit(t.m, "دقیقه")}
            <span className="text-muted-foreground">:</span>
            {unit(t.s, "ثانیه")}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </Container>
    </section>
  );
}
