export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductReview = {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  gender: "men" | "women" | "unisex";
  brand?: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  featured: boolean;
  newArrival: boolean;
  stock: number;
  rating?: number;
  reviewCount?: number;
  freeShipping?: boolean;
  tags?: string[];
  specs?: Record<string, string>;
  reviews?: ProductReview[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  children?: { name: string; slug: string }[];
};
