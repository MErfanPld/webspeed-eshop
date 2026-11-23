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
    <section className="py-10 sm:py-14">
      <Container>
        {data.title && (
          <h2 className="ws-heading text-center text-xl sm:text-[1.7rem] font-extrabold tracking-tight mb-8">
            {data.title}
          </h2>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {data.brands.map((b) => (
            <div
              key={b.id}
              className="relative h-14 w-32 sm:h-16 sm:w-40 rounded-2xl bg-surface border border-border/70 p-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <Image
                src={b.logo}
                alt={b.name}
                fill
                className="object-contain p-1.5"
                sizes="112px"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
