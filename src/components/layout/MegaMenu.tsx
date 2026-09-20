"use client";

import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MegaMenu({ open, onClose }: Props) {
  const cats = categories.filter((c) => c.id !== "all");

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 top-[7.5rem] z-40 bg-foreground/10 hidden lg:block"
        onMouseEnter={onClose}
      />
      <div
        className="absolute top-full right-0 left-0 z-50 hidden lg:block bg-surface border-b border-border shadow-lg"
        onMouseLeave={onClose}
      >
        <div className="mx-auto max-w-content px-6 py-6 grid grid-cols-4 gap-6">
          {cats.map((cat) => (
            <div key={cat.id} className="space-y-3">
              <Link
                href={`/products?category=${cat.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 font-semibold text-sm hover:text-[var(--discount)] transition-colors"
              >
                {cat.image && (
                  <span className="relative h-10 w-10 rounded overflow-hidden bg-muted shrink-0">
                    <Image src={cat.image} alt="" fill className="object-cover" sizes="40px" />
                  </span>
                )}
                {cat.name}
              </Link>
              {cat.children && (
                <ul className="space-y-1.5 pr-1">
                  {cat.children.map((ch) => (
                    <li key={ch.name}>
                      <Link
                        href={`/products?category=${ch.slug}`}
                        onClick={onClose}
                        className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {ch.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div className="col-span-4 flex gap-4 pt-2 border-t border-border">
            <Link href="/products?gender=men" onClick={onClose} className="text-sm font-medium hover:text-[var(--discount)]">
              پوشاک مردانه
            </Link>
            <Link href="/products?gender=women" onClick={onClose} className="text-sm font-medium hover:text-[var(--discount)]">
              پوشاک زنانه
            </Link>
            <Link href="/products?sort=newest" onClick={onClose} className="text-sm font-medium hover:text-[var(--discount)]">
              جدیدترین‌ها
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
