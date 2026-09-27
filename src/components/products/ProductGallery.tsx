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
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
      {list.length > 1 && (
        <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[420px] shrink-0 [scrollbar-width:none]">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-14 sm:h-20 sm:w-16 shrink-0 overflow-hidden rounded-md bg-[#f3f1ef] transition-all",
                active === i
                  ? "ring-2 ring-foreground ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
      <div className="relative flex-1 aspect-[4/5] max-h-[min(52vh,420px)] overflow-hidden rounded-xl bg-[#f3f1ef]">
        <Image
          src={list[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
