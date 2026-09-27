"use client";

import type { PageBlock } from "./types";
import HeroBlockView from "@/blocks/hero/HeroBlock";
import CategoryGridBlockView from "@/blocks/category-grid/CategoryGridBlock";
import ProductSliderBlockView from "@/blocks/product-slider/ProductSliderBlock";
import ProductGridBlockView from "@/blocks/product-grid/ProductGridBlock";
import PromoBannerBlockView from "@/blocks/promo-banner/PromoBannerBlock";
import BrandSliderBlockView from "@/blocks/brand-slider/BrandSliderBlock";
import FeaturesBlockView from "@/blocks/features/FeaturesBlock";
import FlashSaleBlockView from "@/blocks/flash-sale/FlashSaleBlock";
import TestimonialsBlockView from "@/blocks/testimonials/TestimonialsBlock";
import FaqBlockView from "@/blocks/faq/FaqBlock";
import NewsletterBlockView from "@/blocks/newsletter/NewsletterBlock";
import RelatedSliderBlockView from "@/blocks/related-slider/RelatedSliderBlock";

const registry: Record<
  string,
  React.ComponentType<{ block: PageBlock }>
> = {
  hero: HeroBlockView as React.ComponentType<{ block: PageBlock }>,
  "category-grid": CategoryGridBlockView as React.ComponentType<{ block: PageBlock }>,
  "product-slider": ProductSliderBlockView as React.ComponentType<{ block: PageBlock }>,
  "product-grid": ProductGridBlockView as React.ComponentType<{ block: PageBlock }>,
  "promo-banner": PromoBannerBlockView as React.ComponentType<{ block: PageBlock }>,
  "brand-slider": BrandSliderBlockView as React.ComponentType<{ block: PageBlock }>,
  features: FeaturesBlockView as React.ComponentType<{ block: PageBlock }>,
  "flash-sale": FlashSaleBlockView as React.ComponentType<{ block: PageBlock }>,
  testimonials: TestimonialsBlockView as React.ComponentType<{ block: PageBlock }>,
  faq: FaqBlockView as React.ComponentType<{ block: PageBlock }>,
  newsletter: NewsletterBlockView as React.ComponentType<{ block: PageBlock }>,
  "related-slider": RelatedSliderBlockView as React.ComponentType<{ block: PageBlock }>,
};

export function BlockRenderer({ block }: { block: PageBlock }) {
  if (block.enabled === false) return null;
  const View = registry[block.type];
  if (!View) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[BlockRenderer] Unknown block type: ${block.type}`);
    }
    return null;
  }
  return <View block={block} />;
}

export function PageRenderer({ blocks }: { blocks: PageBlock[] }) {
  return (
    <div className="flex flex-col gap-0">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
