"use client";

import Image from "next/image";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { formatNumber } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function AdminCategoriesPage() {
  const cats = categories.filter((c) => c.id !== "all");

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="type-headline">دسته‌بندی‌ها</h1>
          <p className="type-caption mt-1">{formatNumber(cats.length)} دسته</p>
        </div>
        <Button size="sm" type="button">
          افزودن دسته
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cats.map((cat) => {
          const count = products.filter((p) => p.category === cat.slug).length;
          return (
            <div
              key={cat.id}
              className="border border-border flex gap-4 p-4 items-center"
            >
              <div className="relative h-16 w-14 shrink-0 bg-muted overflow-hidden">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{cat.name}</p>
                <p className="type-caption mt-0.5">
                  {formatNumber(count)} محصول ·{" "}
                  <span className="num" data-num>
                    {cat.slug}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
