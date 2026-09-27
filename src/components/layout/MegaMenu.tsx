"use client";

import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MegaMenu({ open, onClose }: Props) {
  if (!open) return null;

  const cats = categories.filter((c) => c.id !== "all");

  return (
    <>
      <div
        className="fixed inset-0 z-[45] bg-black/25"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-0 right-0 z-[50] bg-white border-b border-border shadow-xl"
        style={{ top: "var(--header-offset, 7.5rem)" }}
        role="dialog"
        aria-label="دسته‌بندی‌ها"
      >
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {cats.map((cat) => (
              <div key={cat.id} className="space-y-2.5">
                <Link
                  href={`/products?category=${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2.5 font-bold text-sm text-foreground hover:text-primary transition-colors"
                >
                  {cat.image && (
                    <span className="relative h-9 w-9 rounded-lg overflow-hidden bg-muted shrink-0 ring-1 ring-border">
                      <Image
                        src={
                          cat.image.startsWith("http")
                            ? "/placeholders/samsung-banner.webp"
                            : cat.image
                        }
                        alt=""
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </span>
                  )}
                  {cat.name}
                </Link>
                {cat.children && cat.children.length > 0 && (
                  <ul className="space-y-1.5 pr-1 border-r border-border/60 mr-1">
                    {cat.children.map((ch) => (
                      <li key={ch.name}>
                        <Link
                          href={`/products?category=${ch.slug}`}
                          onClick={onClose}
                          className="block text-[13px] text-muted-foreground hover:text-primary pr-3 py-0.5 transition-colors"
                        >
                          {ch.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border flex flex-wrap gap-4">
            <Link
              href="/products?gender=men"
              onClick={onClose}
              className="text-sm font-semibold text-primary hover:underline"
            >
              پوشاک مردانه
            </Link>
            <Link
              href="/products?gender=women"
              onClick={onClose}
              className="text-sm font-semibold text-primary hover:underline"
            >
              پوشاک زنانه
            </Link>
            <Link
              href="/products"
              onClick={onClose}
              className="text-sm font-semibold text-foreground hover:underline"
            >
              همه محصولات
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
