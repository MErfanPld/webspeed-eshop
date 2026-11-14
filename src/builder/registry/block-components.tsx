"use client";

/**
 * Binds every block definition to its React view.
 * Typed as Record<BlockTypeKey, …>: adding a definition without a view
 * (or a view without a definition) is a compile-time error.
 */
import type { ComponentType } from "react";
import type { PageBlock } from "@/builder/types";
import type { BlockTypeKey } from "./block-definitions";
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
  GridBlock,
  FlexBlock,
} from "@/blocks/layout/LayoutBlocks";
import { AnnouncementBarBlock, MainHeaderBlock } from "@/blocks/header/HeaderBlocks";
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

export type BlockView = ComponentType<{ block: PageBlock }>;

const v = (c: unknown) => c as BlockView;

export const blockComponents: Record<BlockTypeKey, BlockView> = {
  "announcement-bar": v(AnnouncementBarBlock),
  header: v(MainHeaderBlock),
  footer: v(FooterBlock),
  section: v(SectionBlock),
  container: v(ContainerBlock),
  columns: v(ColumnsBlock),
  stack: v(StackBlock),
  grid: v(GridBlock),
  flex: v(FlexBlock),
  spacer: v(SpacerBlock),
  divider: v(DividerBlock),
  hero: v(HeroBlockView),
  "promo-banner": v(PromoBannerBlockView),
  "flash-sale": v(FlashSaleBlockView),
  cta: v(CtaBlock),
  countdown: v(CountdownBlock),
  "add-to-cart-banner": v(AddToCartBannerBlock),
  "product-grid": v(ProductGridBlockView),
  "product-slider": v(ProductSliderBlockView),
  "featured-products": v(ProductGridBlockView),
  "best-sellers": v(ProductSliderBlockView),
  "new-arrivals": v(ProductSliderBlockView),
  "related-slider": v(RelatedSliderBlockView),
  "category-grid": v(CategoryGridBlockView),
  "brand-slider": v(BrandSliderBlockView),
  "logo-cloud": v(LogoCloudBlock),
  heading: v(HeadingBlock),
  text: v(TextBlock),
  "rich-text": v(RichTextBlock),
  button: v(ButtonBlock),
  image: v(ImageBlock),
  video: v(VideoBlock),
  badge: v(BadgeBlock),
  quote: v(QuoteBlock),
  stats: v(StatsBlock),
  faq: v(FaqBlockView),
  accordion: v(AccordionBlock),
  tabs: v(TabsBlock),
  breadcrumbs: v(BreadcrumbsBlock),
  "not-found": v(NotFoundBlock),
  features: v(FeaturesBlockView),
  "trust-badges": v(TrustBadgesBlock),
  "icon-list": v(IconListBlock),
  testimonials: v(TestimonialsBlockView),
  reviews: v(ReviewsBlock),
  newsletter: v(NewsletterBlockView),
  "newsletter-form": v(NewsletterFormBlock),
  "contact-form": v(ContactFormBlock),
  "login-form": v(LoginFormBlock),
  "search-form": v(SearchFormBlock),
};

export function getBlockComponent(type: string): BlockView | undefined {
  return (blockComponents as Record<string, BlockView>)[type];
}
