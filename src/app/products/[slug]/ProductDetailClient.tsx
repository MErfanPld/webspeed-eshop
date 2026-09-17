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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      <ProductGallery images={product.images} alt={product.name} />

      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
            {product.category.replace("-", " ")}
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
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
          <p className="text-sm font-medium mb-3">تعداد</p>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button
          size="lg"
          className="w-full sm:w-auto min-w-[200px]"
          onClick={handleAdd}
        >
          {added ? "به سبد اضافه شد ✓" : "افزودن به سبد"}
        </Button>

        <div className="border-t border-border pt-6 space-y-3 text-sm text-muted-foreground">
          <p>• ارسال در ۲ تا ۴ روز کاری</p>
          <p>• امکان مرجوعی تا ۷ روز</p>
          <p>• موجودی: {product.stock > 0 ? "موجود" : "ناموجود"}</p>
        </div>
      </div>
    </div>
  );
}
