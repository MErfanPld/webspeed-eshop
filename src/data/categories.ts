import { Category } from "@/types/product";

export const categories: Category[] = [
  { id: "all", name: "همه", slug: "all" },
  {
    id: "t-shirts",
    name: "تی‌شرت",
    slug: "t-shirts",
    image: "/placeholders/samsung-banner.webp",
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
    image: "/placeholders/samsung-banner.webp",
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
    image: "/placeholders/samsung-banner.webp",
    children: [
      { name: "هودی", slug: "hoodies" },
      { name: "سویشرت", slug: "hoodies" },
    ],
  },
  {
    id: "jackets",
    name: "کت و پالتو",
    slug: "jackets",
    image: "/placeholders/samsung-banner.webp",
    children: [
      { name: "کت جین", slug: "jackets" },
      { name: "پالتو", slug: "jackets" },
    ],
  },
  {
    id: "pants",
    name: "شلوار",
    slug: "pants",
    image: "/placeholders/samsung-banner.webp",
    children: [
      { name: "شلوار پارچه‌ای", slug: "pants" },
      { name: "کارگو", slug: "pants" },
    ],
  },
  {
    id: "jeans",
    name: "جین",
    slug: "jeans",
    image: "/placeholders/samsung-banner.webp",
    children: [
      { name: "جین بگ", slug: "jeans" },
      { name: "جین اسلیم", slug: "jeans" },
    ],
  },
  {
    id: "accessories",
    name: "اکسسوری",
    slug: "accessories",
    image: "/placeholders/samsung-banner.webp",
    children: [
      { name: "کیف", slug: "accessories" },
      { name: "کمربند", slug: "accessories" },
    ],
  },
];

export const genders = [
  { id: "all", name: "همه" },
  { id: "men", name: "مردانه" },
  { id: "women", name: "زنانه" },
  { id: "unisex", name: "یونی‌سکس" },
];

export const allSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "26",
  "28",
  "30",
  "32",
  "34",
  "36",
  "One Size",
];

export const brands = [
  "WebSpeed",
  "UrbanWeave",
  "Aether",
  "Nova Wear",
  "Minimal Co",
];
