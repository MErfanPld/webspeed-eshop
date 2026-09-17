"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import ProductGallery from "@/components/products/ProductGallery";
import SizeSelector from "@/components/products/SizeSelector";
import ColorSelector from "@/components/products/ColorSelector";
import QuantitySelector from "@/components/products/QuantitySelector";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

type Props = {
  product: Product;
};

export default function ProductDetailClient({ product }: Props) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20">
      <ProductGallery images={product.images} alt={product.name} />

      <div className="space-y-8 lg:pt-4">
        <div>
          <p className="type-label text-muted-foreground mb-3">
            {product.category.replace(/-/g, " ")}
          </p>
          <h1 className="type-headline">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="type-title num" data-num>
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="type-caption line-through num" data-num>
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>

        <p className="type-body text-muted-foreground leading-relaxed max-w-md">
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
          <p className="type-label text-muted-foreground mb-3">تعداد</p>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button
          size="lg"
          className="w-full sm:w-auto min-w-[12rem]"
          onClick={handleAdd}
        >
          {added ? "اضافه شد ✓" : "افزودن به سبد"}
        </Button>

        <div className="pt-2 space-y-2 type-caption">
          <p>ارسال در ۲ تا ۴ روز کاری</p>
          <p>مرجوعی تا ۷ روز</p>
          <p>
            موجودی:{" "}
            <span className="text-foreground">
              {product.stock > 0 ? "موجود" : "ناموجود"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
