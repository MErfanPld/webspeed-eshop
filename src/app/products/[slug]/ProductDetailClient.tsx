"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { formatPrice, formatNumber, cn } from "@/lib/utils";
import ProductGallery from "@/components/products/ProductGallery";
import SizeSelector from "@/components/products/SizeSelector";
import ColorSelector from "@/components/products/ColorSelector";
import QuantitySelector from "@/components/products/QuantitySelector";
import Button from "@/components/ui/Button";
import ReviewSection from "@/components/products/ReviewSection";
import RelatedSliderBlockView from "@/blocks/related-slider/RelatedSliderBlock";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import {
  Star,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  CheckCircle2,
  Share2,
} from "lucide-react";
import type { RelatedSliderBlock } from "@/builder/types";
import Link from "next/link";

type Props = { product: Product };

export default function ProductDetailClient({ product }: Props) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const hasDiscount =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  const relatedIds = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.gender === product.gender)
    )
    .slice(0, 10)
    .map((p) => p.id);

  const relatedBlock: RelatedSliderBlock = {
    id: "related",
    type: "related-slider",
    data: {
      title: "محصولات مشابه",
      productIds: relatedIds,
    },
  };

  const handleAdd = () => {
    if (!size) {
      setError("لطفاً سایز را انتخاب کنید");
      return;
    }
    if (!color) {
      setError("لطفاً رنگ را انتخاب کنید");
      return;
    }
    setError(null);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size,
      color,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const specs = product.specs || {
    جنس: "پارچه منتخب",
    برند: product.brand || "WebSpeed",
    جنسیت:
      product.gender === "men"
        ? "مردانه"
        : product.gender === "women"
          ? "زنانه"
          : "یونیسکس",
    دسته‌بندی: product.category,
    موجودی: product.stock > 0 ? `${product.stock} عدد` : "ناموجود",
  };

  const keyFacts = [
    { label: "برند", value: product.brand || "WebSpeed" },
    {
      label: "وضعیت",
      value: product.stock > 0 ? "موجود در انبار" : "ناموجود",
    },
    {
      label: "ارسال",
      value: product.freeShipping ? "ارسال رایگان" : "ارسال عادی",
    },
  ];

  return (
    <div className="bg-[#f7f7f7] min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-content px-3 sm:px-4 lg:px-6 py-3">
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "محصولات", href: "/products" },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-content px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-5 p-4 sm:p-6 border-b lg:border-b-0 lg:border-l border-border">
              <ProductGallery images={product.images} alt={product.name} />
            </div>

            <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  {product.brand && (
                    <Link
                      href={`/products?q=${encodeURIComponent(product.brand)}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {product.brand}
                    </Link>
                  )}
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-snug text-foreground">
                    {product.name}
                  </h1>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                    aria-label="علاقه‌مندی"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                    aria-label="اشتراک‌گذاری"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold num">
                    {(product.rating ?? 4.5).toFixed(1)}
                  </span>
                  <a
                    href="#reviews"
                    className="text-xs text-muted-foreground hover:text-primary num"
                  >
                    ({formatNumber(product.reviewCount ?? 0)} دیدگاه)
                  </a>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md",
                    product.stock > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {product.stock > 0 ? "موجود" : "ناموجود"}
                </span>
                {product.freeShipping && (
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                    ارسال رایگان
                  </span>
                )}
              </div>

              <div className="rounded-xl bg-[#fafafa] border border-border p-4 space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={cn(
                      "text-2xl sm:text-3xl font-extrabold num",
                      hasDiscount ? "text-primary" : "text-foreground"
                    )}
                  >
                    {formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-base text-muted-foreground line-through num">
                        {formatPrice(product.compareAtPrice!)}
                      </span>
                      <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded num">
                        {formatNumber(discountPct)}٪
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  قیمت نهایی برای همین ترکیب رنگ و سایز
                </p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {keyFacts.map((f) => (
                  <li
                    key={f.label}
                    className="rounded-lg border border-border px-3 py-2 text-xs"
                  >
                    <span className="text-muted-foreground block mb-0.5">
                      {f.label}
                    </span>
                    <span className="font-semibold">{f.value}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-4 pt-1">
                <ColorSelector
                  colors={product.colors}
                  selected={color}
                  onChange={(c) => {
                    setColor(c);
                    setError(null);
                  }}
                />
                <SizeSelector
                  sizes={product.sizes}
                  selected={size}
                  onChange={(s) => {
                    setSize(s);
                    setError(null);
                  }}
                />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    تعداد
                  </p>
                  <QuantitySelector value={quantity} onChange={setQuantity} />
                </div>
              </div>

              {error && (
                <p className="text-sm text-primary font-medium" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  size="lg"
                  className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-hover text-white border-0 font-bold text-sm"
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                >
                  {added ? "به سبد اضافه شد ✓" : "افزودن به سبد خرید"}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                {[
                  { icon: Truck, label: "ارسال سریع" },
                  { icon: RotateCcw, label: "۷ روز بازگشت" },
                  { icon: Shield, label: "ضمانت اصالت" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 py-3 text-center"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-border p-5 sm:p-6 space-y-4">
            <h2 className="text-base font-bold">توضیحات محصول</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
          <div className="lg:col-span-4 bg-white rounded-2xl border border-border p-5 sm:p-6">
            <h2 className="text-base font-bold mb-4">مشخصات فنی</h2>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="flex text-sm">
                  <span className="w-[40%] px-3 py-2.5 text-muted-foreground bg-[#fafafa]">
                    {k}
                  </span>
                  <span className="flex-1 px-3 py-2.5 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id="reviews" className="scroll-mt-24">
        <div className="mx-auto max-w-content px-3 sm:px-4 lg:px-6 pb-4">
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-6">
            <ReviewSection
              rating={product.rating ?? 4.5}
              reviewCount={product.reviewCount ?? 0}
              reviews={product.reviews || []}
            />
          </div>
        </div>
      </section>

      <div className="bg-white border-t border-border mt-2">
        <RelatedSliderBlockView block={relatedBlock} />
      </div>
    </div>
  );
}
