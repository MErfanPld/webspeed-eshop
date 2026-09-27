import type { SerializablePageBlock } from "@/builder/contracts/page-contract";
import type { PageSeo } from "@/builder/contracts/seo-contract";

export type TemplateKind =
  | "home"
  | "product"
  | "category"
  | "search"
  | "cart"
  | "checkout"
  | "not-found"
  | "landing"
  | "blank";

export type PageTemplate = {
  schemaVersion: number;
  id: string;
  kind: TemplateKind;
  name: string;
  nameFa: string;
  description?: string;
  blocks: SerializablePageBlock[];
  seo?: PageSeo;
};

export const TEMPLATE_META: Record<
  TemplateKind,
  { name: string; nameFa: string }
> = {
  home: { name: "Home", nameFa: "خانه" },
  product: { name: "Product Detail", nameFa: "جزئیات محصول" },
  category: { name: "Category / Collection", nameFa: "دسته‌بندی" },
  search: { name: "Search Results", nameFa: "نتایج جستجو" },
  cart: { name: "Cart", nameFa: "سبد خرید" },
  checkout: { name: "Checkout", nameFa: "تسویه" },
  "not-found": { name: "404", nameFa: "۴۰۴" },
  landing: { name: "Landing", nameFa: "لندینگ" },
  blank: { name: "Blank", nameFa: "خالی" },
};
