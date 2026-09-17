"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-[3/4] overflow-hidden bg-muted cursor-zoom-in"
        onClick={() => setZoomed(!zoomed)}
      >
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-300",
            zoomed && "scale-150"
          )}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActive(i);
                setZoomed(false);
              }}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden bg-muted border-2 transition-colors",
                active === i ? "border-foreground" : "border-transparent"
              )}
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
