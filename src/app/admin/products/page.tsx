"use client";

import Image from "next/image";
import { products } from "@/data/products";
import { formatPrice, formatNumber } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="type-headline">محصولات</h1>
          <p className="type-caption mt-1">
            {formatNumber(products.length)} محصول
          </p>
        </div>
        <Button size="sm" type="button">
          افزودن محصول
        </Button>
      </div>

      <div className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/50 type-label text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">محصول</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">دسته</th>
                <th className="px-4 py-3 font-semibold">قیمت</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">موجودی</th>
                <th className="px-4 py-3 font-semibold">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 bg-muted overflow-hidden">
                        <Image
                          src={p.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <span className="font-medium line-clamp-1 max-w-[12rem]">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 type-caption hidden md:table-cell">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 num" data-num>
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-4 py-3 num hidden sm:table-cell" data-num>
                    {formatNumber(p.stock)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs">
                      {p.stock > 0 ? "موجود" : "ناموجود"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
