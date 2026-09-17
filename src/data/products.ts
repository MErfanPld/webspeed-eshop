import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    slug: "oversized-cotton-tee-black",
    name: "تی‌شرت اورسایز نخی مشکی",
    description:
      "تی‌شرت اورسایز با پارچه نخی ۱۰۰٪ درجه یک. برش آزاد و راحت برای استایل روزمره و خیابانی. دوخت تمیز و کیفیت ماندگار.",
    price: 1890000,
    compareAtPrice: 2490000,
    category: "t-shirts",
    gender: "unisex",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "مشکی", hex: "#111111" },
      { name: "سفید", hex: "#F5F5F5" },
      { name: "خاکستری", hex: "#6B7280" },
    ],
    featured: true,
    newArrival: true,
    stock: 42,
  },
  {
    id: "2",
    slug: "wide-leg-denim-jeans",
    name: "شلوار جین بگ",
    description:
      "شلوار جین بگ با برش گشاد و راحت. پارچه دنیم با کیفیت بالا و رنگ ثابت. مناسب استایل مینیمال و خیابانی.",
    price: 3290000,
    compareAtPrice: 3990000,
    category: "jeans",
    gender: "unisex",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "آبی روشن", hex: "#93C5FD" },
      { name: "آبی تیره", hex: "#1E3A8A" },
      { name: "مشکی", hex: "#111111" },
    ],
    featured: true,
    newArrival: false,
    stock: 28,
  },
  {
    id: "3",
    slug: "linen-shirt-beige",
    name: "پیراهن لینن کرم",
    description:
      "پیراهن لینن سبک و خنک با بافت طبیعی. مناسب تابستان و استایل رسمی-کژوال. دکمه‌های چوبی و دوخت ظریف.",
    price: 2450000,
    category: "shirts",
    gender: "men",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1603252109303-16365112bd34?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "کرم", hex: "#E8D5B7" },
      { name: "سفید", hex: "#FFFFFF" },
      { name: "زیتونی", hex: "#6B7F5C" },
    ],
    featured: false,
    newArrival: true,
    stock: 35,
  },
  {
    id: "4",
    slug: "crop-top-white",
    name: "کراپ تاپ سفید",
    description:
      "کراپ تاپ ساده و شیک با پارچه نرم. مناسب لایه‌بندی و استایل روزمره. طراحی مینیمال با کیفیت بالا.",
    price: 890000,
    compareAtPrice: 1190000,
    category: "t-shirts",
    gender: "women",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3021f?w=800&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "سفید", hex: "#FFFFFF" },
      { name: "مشکی", hex: "#111111" },
      { name: "صورتی", hex: "#F9A8D4" },
    ],
    featured: true,
    newArrival: false,
    stock: 50,
  },
  {
    id: "5",
    slug: "hoodie-oversized-gray",
    name: "هودی اورسایز خاکستری",
    description:
      "هودی اورسایز با پنبه سنگین و کلاه بزرگ. مناسب پاییز و زمستان. دوخت داخلی نرم و جیب کانگورویی.",
    price: 2790000,
    category: "hoodies",
    gender: "unisex",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "خاکستری", hex: "#9CA3AF" },
      { name: "مشکی", hex: "#111111" },
      { name: "کرم", hex: "#D6C6B0" },
    ],
    featured: false,
    newArrival: true,
    stock: 22,
  },
  {
    id: "6",
    slug: "pleated-skirt-black",
    name: "دامن پلیسه مشکی",
    description:
      "دامن پلیسه میدی با پارچه سبک و روان. مناسب استایل رسمی و کژوال. کمربند قابل تنظیم.",
    price: 2190000,
    category: "dresses",
    gender: "women",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "مشکی", hex: "#111111" },
      { name: "کرم", hex: "#E8D5B7" },
      { name: "خاکستری", hex: "#6B7280" },
    ],
    featured: false,
    newArrival: false,
    stock: 18,
  },
  {
    id: "7",
    slug: "cargo-pants-olive",
    name: "شلوار کارگو زیتونی",
    description:
      "شلوار کارگو با جیب‌های کاربردی و پارچه مقاوم. مناسب استایل خیابانی و روزمره. برش راحت و مدرن.",
    price: 2590000,
    compareAtPrice: 3100000,
    category: "pants",
    gender: "men",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "زیتونی", hex: "#556B2F" },
      { name: "مشکی", hex: "#111111" },
      { name: "خاکی", hex: "#C3B091" },
    ],
    featured: true,
    newArrival: false,
    stock: 30,
  },
  {
    id: "8",
    slug: "knit-cardigan-cream",
    name: "کاردیگان بافت کرم",
    description:
      "کاردیگان بافت نرم و گرم با طراحی مینیمال. مناسب لایه‌بندی پاییزی. دکمه‌های ظریف و یقه گرد.",
    price: 3100000,
    category: "jackets",
    gender: "women",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "کرم", hex: "#F5E6D3" },
      { name: "خاکستری", hex: "#A8A29E" },
      { name: "مشکی", hex: "#111111" },
    ],
    featured: false,
    newArrival: true,
    stock: 15,
  },
  {
    id: "9",
    slug: "classic-oxford-shirt",
    name: "پیراهن آکسفورد کلاسیک",
    description:
      "پیراهن آکسفورد با بافت محکم و ظاهر شیک. مناسب محیط کار و استایل رسمی. کیفیت بالا و دوام طولانی.",
    price: 2650000,
    category: "shirts",
    gender: "men",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "آبی روشن", hex: "#BFDBFE" },
      { name: "سفید", hex: "#FFFFFF" },
      { name: "صورتی", hex: "#FBCFE8" },
    ],
    featured: true,
    newArrival: false,
    stock: 40,
  },
  {
    id: "10",
    slug: "relaxed-fit-chino",
    name: "شلوار چینو ریلکس",
    description:
      "شلوار چینو با برش راحت و پارچه نرم. مناسب استایل کژوال و نیمه‌رسمی. جزئیات تمیز و کیفیت ممتاز.",
    price: 2350000,
    category: "pants",
    gender: "men",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    ],
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: "بژ", hex: "#D4C4A8" },
      { name: "زیتونی", hex: "#6B7F5C" },
      { name: "سرمه‌ای", hex: "#1E3A5F" },
    ],
    featured: false,
    newArrival: true,
    stock: 25,
  },
  {
    id: "11",
    slug: "silk-blend-blouse",
    name: "بلوز ابریشمی",
    description:
      "بلوز با ترکیب ابریشم و ویسکوز. نرم، لطیف و مناسب استایل شیک. طراحی ساده با جزئیات ظریف.",
    price: 2890000,
    compareAtPrice: 3490000,
    category: "shirts",
    gender: "women",
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "کرم", hex: "#F5E6D3" },
      { name: "مشکی", hex: "#111111" },
      { name: "سفید", hex: "#FFFFFF" },
    ],
    featured: true,
    newArrival: true,
    stock: 20,
  },
  {
    id: "12",
    slug: "denim-jacket-classic",
    name: "کت جین کلاسیک",
    description:
      "کت جین با برش کلاسیک و پارچه دنیم با کیفیت. مناسب لایه‌بندی در تمام فصل‌ها. جزئیات فلزی و دوخت محکم.",
    price: 3590000,
    category: "jackets",
    gender: "unisex",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "آبی", hex: "#3B82F6" },
      { name: "مشکی", hex: "#111111" },
    ],
    featured: true,
    newArrival: false,
    stock: 18,
  },
  {
    id: "13",
    slug: "ribbed-tank-top",
    name: "تاپ ریب",
    description:
      "تاپ ریب با بافت ظریف و کشسانی مناسب. مناسب لایه‌بندی یا استفاده مستقل در فصل گرم.",
    price: 790000,
    category: "t-shirts",
    gender: "women",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3021f?w=800&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "سفید", hex: "#FFFFFF" },
      { name: "مشکی", hex: "#111111" },
      { name: "بژ", hex: "#E8D5B7" },
    ],
    featured: false,
    newArrival: true,
    stock: 45,
  },
  {
    id: "14",
    slug: "wool-blend-coat",
    name: "پالتو پشمی",
    description:
      "پالتو با ترکیب پشم و طراحی مینیمال. گرم، شیک و مناسب زمستان. یقه برگردان و دکمه‌های بزرگ.",
    price: 5890000,
    compareAtPrice: 7200000,
    category: "jackets",
    gender: "women",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "کرم", hex: "#E8D5B7" },
      { name: "مشکی", hex: "#111111" },
      { name: "خاکستری", hex: "#6B7280" },
    ],
    featured: true,
    newArrival: false,
    stock: 12,
  },
  {
    id: "15",
    slug: "slim-fit-trousers",
    name: "شلوار اسلیم فیت",
    description:
      "شلوار اسلیم با پارچه کشی و ظاهر مدرن. مناسب محیط کار و استایل شهری. جزئیات تمیز و دوخت دقیق.",
    price: 2490000,
    category: "pants",
    gender: "men",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    ],
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: "سرمه‌ای", hex: "#1E3A5F" },
      { name: "مشکی", hex: "#111111" },
      { name: "خاکستری", hex: "#6B7280" },
    ],
    featured: false,
    newArrival: false,
    stock: 33,
  },
  {
    id: "16",
    slug: "midi-dress-floral",
    name: "پیراهن میدی",
    description:
      "پیراهن میدی با طراحی ساده و شیک. پارچه سبک و روان مناسب بهار و تابستان. یقه گرد و آستین کوتاه.",
    price: 2750000,
    category: "dresses",
    gender: "women",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "مشکی", hex: "#111111" },
      { name: "کرم", hex: "#F5E6D3" },
      { name: "آبی", hex: "#93C5FD" },
    ],
    featured: true,
    newArrival: true,
    stock: 22,
  },
  {
    id: "17",
    slug: "crewneck-sweatshirt",
    name: "سویشرت کرو",
    description:
      "سویشرت با یقه گرد و پارچه پنبه‌ای نرم. مناسب استایل روزمره و لایه‌بندی. دوخت تمیز و کیفیت بالا.",
    price: 2190000,
    category: "hoodies",
    gender: "unisex",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "خاکستری", hex: "#9CA3AF" },
      { name: "مشکی", hex: "#111111" },
      { name: "سفید", hex: "#F5F5F5" },
    ],
    featured: false,
    newArrival: true,
    stock: 38,
  },
  {
    id: "18",
    slug: "leather-belt-classic",
    name: "کمربند چرمی کلاسیک",
    description:
      "کمربند چرم طبیعی با سگک فلزی مینیمال. مناسب استایل رسمی و کژوال. کیفیت بالا و ماندگاری طولانی.",
    price: 1290000,
    category: "accessories",
    gender: "unisex",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "قهوه‌ای", hex: "#8B4513" },
      { name: "مشکی", hex: "#111111" },
    ],
    featured: false,
    newArrival: false,
    stock: 60,
  },
  {
    id: "19",
    slug: "high-waist-jeans",
    name: "شلوار جین کمر بلند",
    description:
      "شلوار جین کمر بلند با برش مدرن. پارچه دنیم با کشسانی مناسب و ظاهر شیک. مناسب استایل روزمره.",
    price: 2990000,
    compareAtPrice: 3590000,
    category: "jeans",
    gender: "women",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&q=80",
    ],
    sizes: ["26", "28", "30", "32"],
    colors: [
      { name: "آبی تیره", hex: "#1E3A8A" },
      { name: "مشکی", hex: "#111111" },
    ],
    featured: true,
    newArrival: false,
    stock: 27,
  },
  {
    id: "20",
    slug: "minimal-tote-bag",
    name: "کیف توت مینیمال",
    description:
      "کیف توت با طراحی مینیمال و پارچه محکم. مناسب استفاده روزانه. فضای داخلی جادار و دسته‌های راحت.",
    price: 1590000,
    category: "accessories",
    gender: "unisex",
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a67478a?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    ],
    sizes: ["One Size"],
    colors: [
      { name: "کرم", hex: "#E8D5B7" },
      { name: "مشکی", hex: "#111111" },
      { name: "خاکی", hex: "#C3B091" },
    ],
    featured: false,
    newArrival: true,
    stock: 35,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.newArrival);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.gender === product.gender)
    )
    .slice(0, limit);
}
