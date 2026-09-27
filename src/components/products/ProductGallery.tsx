"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const list =
    images?.length > 0
      ? images.map((img) =>
          img && !img.startsWith("http")
            ? img
            : "/placeholders/samsung-banner.webp"
        )
      : ["/placeholders/samsung-banner.webp"];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-square max-h-[380px] overflow-hidden rounded-xl bg-[#f3f1ef]">
        <Image
          src={list[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-contain p-2"
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f3f1ef] transition-all",
                active === i
                  ? "ring-2 ring-primary ring-offset-1"
                  : "opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
