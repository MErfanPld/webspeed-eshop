"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Search } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl px-4 pt-8">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی محصولات..."
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label="بستن جستجو"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 max-h-[70vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              نتیجه‌ای یافت نشد.
            </p>
          )}
          <ul className="space-y-3">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-2 hover:bg-muted rounded-sm transition-colors"
                >
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-muted">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
