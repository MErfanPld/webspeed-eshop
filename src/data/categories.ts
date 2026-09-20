import { Category } from "@/types/product";

export const categories: Category[] = [
  { id: "all", name: "همه", slug: "all" },
  {
    id: "t-shirts",
    name: "تی‌شرت",
    slug: "t-shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=55",
    children: [
      { name: "تی‌شرت ساده", slug: "t-shirts" },
      { name: "تی‌شرت اورسایز", slug: "t-shirts" },
      { name: "پولوشرت", slug: "t-shirts" },
    ],
  },
  {
    id: "shirts",
    name: "پیراهن",
    slug: "shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=55",
    children: [
      { name: "پیراهن رسمی", slug: "shirts" },
      { name: "پیراهن کژوال", slug: "shirts" },
      { name: "لینن", slug: "shirts" },
    ],
  },
  {
    id: "hoodies",
    name: "هودی و سویشرت",
    slug: "hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=55",
    children: [
      { name: "هودی", slug: "hoodies" },
      { name: "سویشرت", slug: "hoodies" },
    ],
  },
  {
    id: "jackets",
    name: "کت و پالتو",
    slug: "jackets",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=55",
    children: [
      { name: "کت جین", slug: "jackets" },
      { name: "پالتو", slug: "jackets" },
      { name: "بارانی", slug: "jackets" },
    ],
  },
  {
    id: "pants",
    name: "شلوار",
    slug: "pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=55",
    children: [
      { name: "شلوار پارچه‌ای", slug: "pants" },
      { name: "کارگو", slug: "pants" },
    ],
  },
  {
    id: "jeans",
    name: "جین",
    slug: "jeans",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=55",
    children: [
      { name: "جین بگ", slug: "jeans" },
      { name: "جین اسکینی", slug: "jeans" },
      { name: "جین راسته", slug: "jeans" },
    ],
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
  "28", "30", "32", "34", "36", "38",
];

export const brands = [
  "WebSpeed",
  "UrbanWeave",
  "Minimal Co",
  "Nova Wear",
  "Aether",
];
