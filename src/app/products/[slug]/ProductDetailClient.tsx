"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { formatPrice, formatNumber } from "@/lib/utils";
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
import { Star, Truck, Shield, RotateCcw, Heart } from "lucide-react";
import type { RelatedSliderBlock } from "@/builder/types";

type Props = { product: Product };

export default function ProductDetailClient({ product }: Props) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
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
      title: "کالاهای مرتبط",
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
    موجودی: product.stock > 0 ? "موجود" : "ناموجود",
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb
          items={[
            { label: "خانه", href: "/" },
            { label: "محصولات", href: "/products" },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} alt={product.name} />
          </div>

          <div className="lg:col-span-5 space-y-6">
            {product.brand && (
              <p className="text-xs text-muted-foreground tracking-wide">
                {product.brand}
              </p>
            )}
            <h1 className="text-2xl sm:text-[1.75rem] font-bold leading-snug tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium num">
                  {(product.rating ?? 4.5).toFixed(1)}
                </span>
              </div>
              <a
                href="#reviews"
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline num"
              >
                {formatNumber(product.reviewCount ?? 0)} نظر
              </a>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-bold num">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-muted-foreground line-through num">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                  <span className="bg-[var(--discount)] text-white text-xs font-bold px-2.5 py-1 rounded-full num">
                    {formatNumber(discountPct)}٪
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

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
              <p className="text-xs font-medium text-muted-foreground mb-2.5">
                تعداد
              </p>
              <QuantitySelector value={quantity} onChange={setQuantity} />
            </div>

            {error && (
              <p className="text-sm text-[var(--discount)]" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 h-12 rounded-xl bg-foreground text-background border-0 font-semibold"
                onClick={handleAdd}
              >
                {added ? "اضافه شد ✓" : "افزودن به سبد"}
              </Button>
              <button
                type="button"
                className="h-12 w-12 rounded-xl border border-border flex items-center justify-center hover:bg-muted"
                aria-label="علاقه‌مندی"
              >
                <Heart className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "ارسال سریع" },
                { icon: RotateCcw, label: "۷ روز بازگشت" },
                { icon: Shield, label: "ضمانت اصالت" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 text-center p-3 rounded-xl bg-muted/60"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="flex text-sm">
                  <span className="w-1/3 px-4 py-2.5 text-muted-foreground bg-muted/40">
                    {k}
                  </span>
                  <span className="flex-1 px-4 py-2.5 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id="reviews" className="scroll-mt-24 border-t border-border">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <ReviewSection
            rating={product.rating ?? 4.5}
            reviewCount={product.reviewCount ?? 0}
            reviews={product.reviews || []}
          />
        </div>
      </section>

      <div className="border-t border-border">
        <RelatedSliderBlockView block={relatedBlock} />
      </div>
    </div>
  );
}
