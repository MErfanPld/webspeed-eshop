"use client";

import Image from "next/image";
import type {
  BrandSliderBlock as BrandSliderBlockType,
  PageBlock,
} from "@/builder/types";
import Container from "@/components/ui/Container";

export default function BrandSliderBlockView({
  block,
}: {
  block: PageBlock;
}) {
  const data = (block as BrandSliderBlockType).data;
  return (
    <section className="py-10 sm:py-14 border-y border-border bg-surface">
      <Container>
        {data.title && (
          <h2 className="text-center text-sm font-semibold tracking-wide text-muted-foreground mb-8 uppercase">
            {data.title}
          </h2>
        )}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {data.brands.map((b) => (
            <div
              key={b.id}
              className="relative h-10 w-24 sm:h-12 sm:w-28 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            >
              <Image
                src={b.logo}
                alt={b.name}
                fill
                className="object-contain"
                sizes="112px"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
