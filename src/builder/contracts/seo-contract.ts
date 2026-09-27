export type PageSeo = {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};

export const EMPTY_SEO: PageSeo = {};
