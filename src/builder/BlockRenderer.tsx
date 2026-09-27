"use client";

import type { ComponentType } from "react";
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
import {
  SectionBlock,
  ContainerBlock,
  ColumnsBlock,
  SpacerBlock,
  DividerBlock,
  StackBlock,
} from "@/blocks/layout/LayoutBlocks";
import {
  AnnouncementBarBlock,
  MainHeaderBlock,
} from "@/blocks/header/HeaderBlocks";
import {
  FooterBlock,
  RichTextBlock,
  ImageBlock,
  TrustBadgesBlock,
  BreadcrumbsBlock,
  NotFoundBlock,
} from "@/blocks/footer/FooterBlocks";

const registry: Record<string, ComponentType<{ block: PageBlock }>> = {
  hero: HeroBlockView as ComponentType<{ block: PageBlock }>,
  "category-grid": CategoryGridBlockView as ComponentType<{ block: PageBlock }>,
  "product-slider": ProductSliderBlockView as ComponentType<{ block: PageBlock }>,
  "product-grid": ProductGridBlockView as ComponentType<{ block: PageBlock }>,
  "promo-banner": PromoBannerBlockView as ComponentType<{ block: PageBlock }>,
  "brand-slider": BrandSliderBlockView as ComponentType<{ block: PageBlock }>,
  features: FeaturesBlockView as ComponentType<{ block: PageBlock }>,
  "flash-sale": FlashSaleBlockView as ComponentType<{ block: PageBlock }>,
  testimonials: TestimonialsBlockView as ComponentType<{ block: PageBlock }>,
  faq: FaqBlockView as ComponentType<{ block: PageBlock }>,
  newsletter: NewsletterBlockView as ComponentType<{ block: PageBlock }>,
  "related-slider": RelatedSliderBlockView as ComponentType<{ block: PageBlock }>,
  section: SectionBlock as ComponentType<{ block: PageBlock }>,
  container: ContainerBlock as ComponentType<{ block: PageBlock }>,
  columns: ColumnsBlock as ComponentType<{ block: PageBlock }>,
  stack: StackBlock as ComponentType<{ block: PageBlock }>,
  spacer: SpacerBlock as ComponentType<{ block: PageBlock }>,
  divider: DividerBlock as ComponentType<{ block: PageBlock }>,
  "announcement-bar": AnnouncementBarBlock as ComponentType<{ block: PageBlock }>,
  header: MainHeaderBlock as ComponentType<{ block: PageBlock }>,
  footer: FooterBlock as ComponentType<{ block: PageBlock }>,
  "rich-text": RichTextBlock as ComponentType<{ block: PageBlock }>,
  image: ImageBlock as ComponentType<{ block: PageBlock }>,
  "trust-badges": TrustBadgesBlock as ComponentType<{ block: PageBlock }>,
  breadcrumbs: BreadcrumbsBlock as ComponentType<{ block: PageBlock }>,
  "not-found": NotFoundBlock as ComponentType<{ block: PageBlock }>,
  "featured-products": ProductGridBlockView as ComponentType<{ block: PageBlock }>,
  "best-sellers": ProductSliderBlockView as ComponentType<{ block: PageBlock }>,
  "new-arrivals": ProductSliderBlockView as ComponentType<{ block: PageBlock }>,
};

export function BlockRenderer({ block }: { block: PageBlock }) {
  if (block.enabled === false) return null;
  const View = registry[block.type];
  if (!View) {
    return (
      <div className="mx-4 my-2 rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
        بلوک ناشناخته: {block.type}
      </div>
    );
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
