/**
 * Page Builder — Block System Types
 * Configuration-driven sections for multi-industry e-commerce.
 */

export type BlockType =
  | "hero"
  | "promo-banner"
  | "category-grid"
  | "category-carousel"
  | "product-grid"
  | "product-slider"
  | "flash-sale"
  | "brand-slider"
  | "features"
  | "stats"
  | "testimonials"
  | "faq"
  | "newsletter"
  | "related-slider"
  | "text-content"
  | "trust"
  | "video";

export type BlockBase = {
  id: string;
  type: BlockType;
  enabled?: boolean;
  settings?: Record<string, unknown>;
};

export type HeroSlide = {
  id: string;
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  align?: "right" | "center" | "left";
};

export type HeroBlock = BlockBase & {
  type: "hero";
  data: {
    slides: HeroSlide[];
    autoplay?: boolean;
    intervalMs?: number;
  };
};

export type PromoBannerBlock = BlockBase & {
  type: "promo-banner";
  data: {
    title: string;
    subtitle?: string;
    image?: string;
    ctaLabel?: string;
    ctaHref?: string;
    variant?: "full" | "split" | "minimal";
  };
};

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  count?: number;
};

export type CategoryGridBlock = BlockBase & {
  type: "category-grid";
  data: {
    title?: string;
    subtitle?: string;
    categories: CategoryItem[];
    columns?: 2 | 3 | 4 | 6;
  };
};

export type ProductSliderBlock = BlockBase & {
  type: "product-slider";
  data: {
    title: string;
    subtitle?: string;
    productIds?: string[];
    source?: "featured" | "new" | "bestsellers" | "all";
    limit?: number;
    viewAllHref?: string;
  };
};

export type ProductGridBlock = BlockBase & {
  type: "product-grid";
  data: {
    title?: string;
    productIds?: string[];
    source?: "featured" | "new" | "bestsellers" | "all";
    limit?: number;
    columns?: 2 | 3 | 4;
  };
};

export type FlashSaleBlock = BlockBase & {
  type: "flash-sale";
  data: {
    title: string;
    endsAt: string;
    productIds?: string[];
    limit?: number;
  };
};

export type BrandItem = {
  id: string;
  name: string;
  logo: string;
  href?: string;
};

export type BrandSliderBlock = BlockBase & {
  type: "brand-slider";
  data: {
    title?: string;
    brands: BrandItem[];
  };
};

export type FeatureItem = {
  id: string;
  icon?: string;
  title: string;
  description: string;
};

export type FeaturesBlock = BlockBase & {
  type: "features";
  data: {
    title?: string;
    items: FeatureItem[];
  };
};

export type StatItem = {
  id: string;
  value: string;
  label: string;
};

export type StatsBlock = BlockBase & {
  type: "stats";
  data: {
    items: StatItem[];
  };
};

export type TestimonialItem = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  rating?: number;
  text: string;
};

export type TestimonialsBlock = BlockBase & {
  type: "testimonials";
  data: {
    title: string;
    items: TestimonialItem[];
  };
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqBlock = BlockBase & {
  type: "faq";
  data: {
    title: string;
    items: FaqItem[];
  };
};

export type NewsletterBlock = BlockBase & {
  type: "newsletter";
  data: {
    title: string;
    subtitle?: string;
    placeholder?: string;
    buttonLabel?: string;
  };
};

export type RelatedSliderBlock = BlockBase & {
  type: "related-slider";
  data: {
    title: string;
    productIds: string[];
  };
};

export type TextContentBlock = BlockBase & {
  type: "text-content";
  data: {
    title?: string;
    body: string;
    align?: "right" | "center";
  };
};

export type TrustBlock = BlockBase & {
  type: "trust";
  data: {
    items: FeatureItem[];
  };
};

export type PageBlock =
  | HeroBlock
  | PromoBannerBlock
  | CategoryGridBlock
  | ProductSliderBlock
  | ProductGridBlock
  | FlashSaleBlock
  | BrandSliderBlock
  | FeaturesBlock
  | StatsBlock
  | TestimonialsBlock
  | FaqBlock
  | NewsletterBlock
  | RelatedSliderBlock
  | TextContentBlock
  | TrustBlock;

export type PageConfig = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  blocks: PageBlock[];
};
