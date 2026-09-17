import { Category } from "@/types/product";

export const categories: Category[] = [
  { id: "all", name: "همه", slug: "all" },
  {
    id: "t-shirts",
    name: "تی‌شرت",
    slug: "t-shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    id: "shirts",
    name: "پیراهن",
    slug: "shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  },
  {
    id: "hoodies",
    name: "هودی و سویشرت",
    slug: "hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
  },
  {
    id: "jackets",
    name: "کت و پالتو",
    slug: "jackets",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80",
  },
  {
    id: "pants",
    name: "شلوار",
    slug: "pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
  },
  {
    id: "jeans",
    name: "جین",
    slug: "jeans",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
  },
  {
    id: "dresses",
    name: "پیراهن و دامن",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
  },
  {
    id: "accessories",
    name: "اکسسوری",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a67478a?w=600&q=80",
  },
];

export const genders = [
  { id: "all", name: "همه" },
  { id: "men", name: "مردانه" },
  { id: "women", name: "زنانه" },
  { id: "unisex", name: "یونیسکس" },
];

export const allSizes = [
  "XS", "S", "M", "L", "XL", "XXL",
  "26", "28", "30", "32", "34", "36",
  "One Size",
];
