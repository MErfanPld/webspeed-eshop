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
import ProductGrid from "@/components/products/ProductGrid";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { Star, Truck, Shield, RotateCcw, Heart } from "lucide-react";

type Props = { product: Product };
type Tab = "desc" | "specs" | "reviews";

export default function ProductDetailClient({ product }: Props) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<Tab>("desc");
  const { addItem } = useCart();

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100
      )
    : 0;

  const similar = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.gender === product.gender || p.featured) &&
        p.category !== product.category
    )
    .slice(0, 4);

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
    <div className="space-y-14 sm:space-y-20">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "پوشاک", href: "/products" },
          {
            label:
              product.gender === "men"
                ? "مردانه"
                : product.gender === "women"
                  ? "زنانه"
                  : "همه",
            href: `/products?gender=${product.gender}`,
          },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            {product.brand && (
              <p className="text-xs text-muted-foreground tracking-wide uppercase">
                {product.brand}
              </p>
            )}
            <h1 className="text-2xl sm:text-[1.75rem] font-bold leading-snug tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium num" data-num>
                  {(product.rating ?? 4.5).toFixed(1)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTab("reviews");
                  document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline num"
                data-num
              >
                {formatNumber(product.reviewCount ?? 0)} نظر
              </button>
              {product.freeShipping && (
                <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                  ارسال رایگان
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-bold num" data-num>
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-muted-foreground line-through num" data-num>
                  {formatPrice(product.compareAtPrice!)}
                </span>
                <span className="bg-[var(--discount)] text-white text-xs font-bold px-2.5 py-1 rounded-full num">
                  {formatNumber(discountPct)}٪ تخفیف
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-5 pt-1">
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
              <p className="text-xs font-medium text-muted-foreground mb-2.5">تعداد</p>
              <QuantitySelector value={quantity} onChange={setQuantity} />
            </div>
          </div>

          {error && (
            <p className="text-sm text-[var(--discount)]" role="alert">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <Button
              size="lg"
              className="flex-1 h-12 rounded-lg bg-foreground hover:bg-foreground/90 text-background border-0 font-semibold"
              onClick={handleAdd}
            >
              {added ? "اضافه شد ✓" : "افزودن به سبد"}
            </Button>
            <button
              type="button"
              className="h-12 w-12 shrink-0 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="علاقه‌مندی"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, label: "ارسال سریع" },
              { icon: RotateCcw, label: "۷ روز بازگشت" },
              { icon: Shield, label: "ضمانت اصالت" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 text-center p-3 rounded-lg bg-muted/60"
              >
                <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex gap-0 border-b border-border overflow-x-auto">
          {(
            [
              ["desc", "توضیحات"],
              ["specs", "مشخصات"],
              ["reviews", "نظرات"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setTab(key);
                if (key === "reviews") {
                  document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={cn(
                "px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
                tab === key
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="py-8">
          {tab === "desc" && (
            <p className="text-sm leading-relaxed text-foreground/80 max-w-2xl">
              {product.description}
            </p>
          )}
          {tab === "specs" && (
            <div className="max-w-md divide-y divide-border rounded-xl border border-border overflow-hidden">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="flex text-sm even:bg-muted/40">
                  <span className="w-1/3 px-4 py-3 text-muted-foreground">{k}</span>
                  <span className="flex-1 px-4 py-3 font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "reviews" && (
            <ReviewSection
              rating={product.rating ?? 4.5}
              reviewCount={product.reviewCount ?? 0}
              reviews={product.reviews || []}
            />
          )}
        </div>
      </div>

      <section id="reviews" className="scroll-mt-28">
        <h2 className="text-lg font-bold mb-6">نظرات کاربران</h2>
        <ReviewSection
          rating={product.rating ?? 4.5}
          reviewCount={product.reviewCount ?? 0}
          reviews={product.reviews || []}
        />
      </section>

      {similar.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-6">کالاهای مشابه</h2>
          <ProductGrid products={similar} />
        </section>
      )}

      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-6">محصولات مرتبط</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
