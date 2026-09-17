export type ProductColor = {
  name: string;
  hex: string;
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
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  featured: boolean;
  newArrival: boolean;
  stock: number;
  tags?: string[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string;
};
