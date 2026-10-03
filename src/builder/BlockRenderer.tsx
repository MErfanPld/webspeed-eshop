"use client";

import type { ComponentType } from "react";
import type { PageBlock } from "./types";
import { usePreviewDevice } from "@/builder/responsive/device-context";
import {
  isVisibleOnDevice,
  type VisibilitySettings,
} from "@/builder/responsive/types";
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
import {
  HeadingBlock,
  TextBlock,
  ButtonBlock,
  BadgeBlock,
  QuoteBlock,
  VideoBlock,
  CtaBlock,
  StatsBlock,
  CountdownBlock,
  AccordionBlock,
  TabsBlock,
  LogoCloudBlock,
  GridBlock,
  FlexBlock,
  ReviewsBlock,
  AddToCartBannerBlock,
} from "@/blocks/content/ContentBlocks";
import {
  ContactFormBlock,
  NewsletterFormBlock,
  LoginFormBlock,
  SearchFormBlock,
  IconListBlock,
} from "@/blocks/content/FormBlocks";

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
  heading: HeadingBlock as ComponentType<{ block: PageBlock }>,
  text: TextBlock as ComponentType<{ block: PageBlock }>,
  button: ButtonBlock as ComponentType<{ block: PageBlock }>,
  badge: BadgeBlock as ComponentType<{ block: PageBlock }>,
  quote: QuoteBlock as ComponentType<{ block: PageBlock }>,
  video: VideoBlock as ComponentType<{ block: PageBlock }>,
  cta: CtaBlock as ComponentType<{ block: PageBlock }>,
  stats: StatsBlock as ComponentType<{ block: PageBlock }>,
  countdown: CountdownBlock as ComponentType<{ block: PageBlock }>,
  accordion: AccordionBlock as ComponentType<{ block: PageBlock }>,
  tabs: TabsBlock as ComponentType<{ block: PageBlock }>,
  "logo-cloud": LogoCloudBlock as ComponentType<{ block: PageBlock }>,
  grid: GridBlock as ComponentType<{ block: PageBlock }>,
  flex: FlexBlock as ComponentType<{ block: PageBlock }>,
  reviews: ReviewsBlock as ComponentType<{ block: PageBlock }>,
  "add-to-cart-banner": AddToCartBannerBlock as ComponentType<{ block: PageBlock }>,
  "contact-form": ContactFormBlock as ComponentType<{ block: PageBlock }>,
  "newsletter-form": NewsletterFormBlock as ComponentType<{ block: PageBlock }>,
  "login-form": LoginFormBlock as ComponentType<{ block: PageBlock }>,
  "search-form": SearchFormBlock as ComponentType<{ block: PageBlock }>,
  "icon-list": IconListBlock as ComponentType<{ block: PageBlock }>,
};

export function BlockRenderer({ block }: { block: PageBlock }) {
  const device = usePreviewDevice();
  if (block.enabled === false) return null;
  const data = (block as { data?: Record<string, unknown> }).data;
  const vis = data?._visibility as VisibilitySettings | undefined;
  if (!isVisibleOnDevice(vis, device)) return null;
  const View = registry[block.type];
  if (!View) {
    return (
      <div className="m-2 rounded-lg border border-dashed border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
        بلوک ناشناخته: <code className="font-mono">{block.type}</code>
      </div>
    );
  }
  return <View block={block} />;
}

export default BlockRenderer;
