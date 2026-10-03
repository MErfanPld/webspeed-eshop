import type { BlockDefinition } from "@/builder/schema-types";

const PLACEHOLDER = "/placeholders/samsung-banner.webp";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const blockRegistry: BlockDefinition[] = [
  {
    type: "announcement-bar",
    name: "Announcement Bar",
    nameFa: "نوار اعلان",
    category: "header",
    description: "نوار بالای سایت",
    icon: "Megaphone",
    defaultData: {
      text: "ارسال رایگان برای سفارش‌های بالای ۲٬۵۰۰٬۰۰۰ تومان",
      href: "/products",
      background: "#0f172a",
      textColor: "#ffffff",
    },
    schema: [
      { type: "text", label: "متن", path: "text" },
      { type: "url", label: "لینک", path: "href" },
      { type: "color", label: "پس‌زمینه", path: "background" },
      { type: "color", label: "رنگ متن", path: "textColor" },
    ],
  },
  {
    type: "header",
    name: "Main Header",
    nameFa: "هدر اصلی",
    category: "header",
    description: "لوگو، منو، جستجو، سبد",
    icon: "PanelTop",
    defaultData: {
      logoText: "WebSpeed",
      sticky: true,
      showSearch: true,
      showCart: true,
      showAccount: true,
      showWishlist: false,
      showCta: false,
      ctaLabel: "خرید",
      ctaHref: "/products",
      background: "#ffffff",
      textColor: "#111111",
      borderColor: "#E8E8E8",
      navItems: [
        { label: "خانه", href: "/" },
        { label: "مردانه", href: "/products?gender=men" },
        { label: "زنانه", href: "/products?gender=women" },
        { label: "درباره ما", href: "/about" },
      ],
    },
    schema: [
      { type: "text", label: "لوگو", path: "logoText", group: "برند" },
      { type: "color", label: "پس‌زمینه", path: "background", group: "ظاهر" },
      { type: "color", label: "رنگ متن", path: "textColor", group: "ظاهر" },
      { type: "boolean", label: "Sticky", path: "sticky", group: "رفتار" },
      { type: "boolean", label: "جستجو", path: "showSearch", group: "اقدامات" },
      { type: "boolean", label: "سبد", path: "showCart", group: "اقدامات" },
      { type: "boolean", label: "حساب", path: "showAccount", group: "اقدامات" },
      { type: "boolean", label: "CTA", path: "showCta", group: "اقدامات" },
      { type: "text", label: "متن CTA", path: "ctaLabel", group: "اقدامات" },
      { type: "url", label: "لینک CTA", path: "ctaHref", group: "اقدامات" },
      {
        type: "array",
        label: "منو",
        path: "navItems",
        group: "منو",
        defaultItem: { label: "لینک", href: "/" },
        itemFields: [
          { type: "text", label: "عنوان", path: "label" },
          { type: "url", label: "لینک", path: "href" },
        ],
      },
    ],
  },
  {
    type: "hero",
    name: "Hero Banner",
    nameFa: "بنر اصلی",
    category: "marketing",
    description: "اسلایدر بزرگ",
    icon: "Image",
    defaultData: {
      autoplay: true,
      intervalMs: 5000,
      slides: [
        {
          id: uid("slide"),
          image: PLACEHOLDER,
          eyebrow: "فصل جدید",
          title: "عنوان بنر",
          subtitle: "توضیح کوتاه",
          ctaLabel: "مشاهده",
          ctaHref: "/products",
          align: "right",
        },
      ],
    },
    schema: [
      { type: "boolean", label: "پخش خودکار", path: "autoplay" },
      { type: "number", label: "فاصله (ms)", path: "intervalMs", min: 2000, max: 15000 },
    ],
  },
  {
    type: "product-grid",
    name: "Product Grid",
    nameFa: "گرید محصولات",
    category: "products",
    description: "شبکه محصولات",
    icon: "LayoutGrid",
    defaultData: { title: "محصولات", source: "all", limit: 8, columns: 4 },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      { type: "number", label: "تعداد", path: "limit", min: 2, max: 16 },
    ],
  },
  {
    type: "product-slider",
    name: "Product Slider",
    nameFa: "اسلایدر محصولات",
    category: "products",
    description: "نمایش افقی",
    icon: "LayoutList",
    defaultData: {
      title: "محصولات منتخب",
      source: "featured",
      limit: 8,
      viewAllHref: "/products",
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      { type: "number", label: "تعداد", path: "limit", min: 2, max: 16 },
    ],
  },
  {
    type: "category-grid",
    name: "Category Grid",
    nameFa: "گرید دسته‌بندی",
    category: "catalog",
    description: "نمایش دسته‌ها",
    icon: "FolderTree",
    defaultData: {
      title: "دسته‌بندی‌ها",
      categories: [
        { id: uid("cat"), name: "تی‌شرت", slug: "t-shirts", image: PLACEHOLDER, count: 12 },
        { id: uid("cat"), name: "هودی", slug: "hoodies", image: PLACEHOLDER, count: 8 },
      ],
    },
    schema: [{ type: "text", label: "عنوان", path: "title" }],
  },
  {
    type: "heading",
    name: "Heading",
    nameFa: "عنوان",
    category: "content",
    description: "H1–H4",
    icon: "Type",
    defaultData: { text: "عنوان بخش", level: 2 },
    schema: [
      { type: "text", label: "متن", path: "text" },
      { type: "number", label: "سطح", path: "level", min: 1, max: 4 },
    ],
  },
  {
    type: "text",
    name: "Text",
    nameFa: "متن",
    category: "content",
    description: "پاراگراف",
    icon: "Type",
    defaultData: { text: "متن خود را اینجا بنویسید." },
    schema: [{ type: "textarea", label: "متن", path: "text" }],
  },
  {
    type: "button",
    name: "Button",
    nameFa: "دکمه",
    category: "content",
    description: "CTA",
    icon: "Square",
    defaultData: { label: "خرید کنید", href: "/products", variant: "primary" },
    schema: [
      { type: "text", label: "برچسب", path: "label" },
      { type: "url", label: "لینک", path: "href" },
    ],
  },
  {
    type: "image",
    name: "Image",
    nameFa: "تصویر",
    category: "content",
    description: "تصویر",
    icon: "Image",
    defaultData: { src: PLACEHOLDER, alt: "" },
    schema: [
      { type: "image", label: "تصویر", path: "src" },
      { type: "text", label: "Alt", path: "alt" },
    ],
  },
  {
    type: "spacer",
    name: "Spacer",
    nameFa: "فاصله‌گذار",
    category: "layout",
    description: "فضای خالی",
    icon: "Square",
    defaultData: { height: 32 },
    schema: [{ type: "number", label: "ارتفاع", path: "height", min: 8, max: 200 }],
  },
  {
    type: "divider",
    name: "Divider",
    nameFa: "جداکننده",
    category: "layout",
    description: "خط افقی",
    icon: "Square",
    defaultData: { color: "#E8E8E8" },
    schema: [{ type: "color", label: "رنگ", path: "color" }],
  },
  {
    type: "contact-form",
    name: "Contact Form",
    nameFa: "فرم تماس",
    category: "forms",
    description: "فرم تماس",
    icon: "Mail",
    defaultData: {
      title: "تماس با ما",
      subtitle: "پیام خود را برای ما بفرستید",
      buttonLabel: "ارسال پیام",
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      { type: "text", label: "زیرعنوان", path: "subtitle" },
      { type: "text", label: "دکمه", path: "buttonLabel" },
    ],
  },
  {
    type: "newsletter-form",
    name: "Newsletter Form",
    nameFa: "فرم خبرنامه",
    category: "forms",
    description: "خبرنامه",
    icon: "Mail",
    defaultData: {
      title: "عضویت در خبرنامه",
      placeholder: "ایمیل شما",
      buttonLabel: "عضویت",
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      { type: "text", label: "Placeholder", path: "placeholder" },
      { type: "text", label: "دکمه", path: "buttonLabel" },
    ],
  },
  {
    type: "login-form",
    name: "Login Form",
    nameFa: "فرم ورود",
    category: "forms",
    description: "ورود",
    icon: "User",
    defaultData: {
      title: "ورود / ثبت‌نام",
      placeholder: "0912xxxxxxx",
      buttonLabel: "دریافت کد",
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      { type: "text", label: "Placeholder", path: "placeholder" },
      { type: "text", label: "دکمه", path: "buttonLabel" },
    ],
  },
  {
    type: "search-form",
    name: "Search Form",
    nameFa: "فرم جستجو",
    category: "forms",
    description: "جستجو",
    icon: "Search",
    defaultData: { placeholder: "جستجوی محصول...", buttonLabel: "جستجو" },
    schema: [
      { type: "text", label: "Placeholder", path: "placeholder" },
      { type: "text", label: "دکمه", path: "buttonLabel" },
    ],
  },
  {
    type: "footer",
    name: "Footer",
    nameFa: "فوتر",
    category: "footer",
    description: "پاورقی",
    icon: "PanelBottom",
    defaultData: {
      brand: "WebSpeed",
      description: "فروشگاه اینترنتی پوشاک مینیمال.",
      phone: "021-12345678",
      email: "info@webspeed.ir",
      address: "تهران",
      showNewsletter: true,
      newsletterTitle: "خبرنامه",
      background: "#0f172a",
      textColor: "#f8fafc",
      copyright: "© 2026 WebSpeed",
      columns: [
        {
          title: "فروشگاه",
          links: [
            { label: "محصولات", href: "/products" },
            { label: "مردانه", href: "/products?gender=men" },
          ],
        },
        {
          title: "پشتیبانی",
          links: [
            { label: "تماس", href: "/contact" },
            { label: "درباره", href: "/about" },
          ],
        },
      ],
      socials: [
        { label: "اینستاگرام", href: "#" },
        { label: "تلگرام", href: "#" },
      ],
    },
    schema: [
      { type: "text", label: "برند", path: "brand" },
      { type: "textarea", label: "توضیح", path: "description" },
      { type: "text", label: "تلفن", path: "phone" },
      { type: "text", label: "ایمیل", path: "email" },
      { type: "text", label: "آدرس", path: "address" },
      { type: "boolean", label: "خبرنامه", path: "showNewsletter" },
      { type: "color", label: "پس‌زمینه", path: "background" },
      { type: "color", label: "رنگ متن", path: "textColor" },
      { type: "text", label: "کپی‌رایت", path: "copyright" },
    ],
  },
  {
    type: "features",
    name: "Features",
    nameFa: "ویژگی‌ها",
    category: "store",
    description: "ارسال و ضمانت",
    icon: "Shield",
    defaultData: {
      items: [
        { id: uid("f"), icon: "truck", title: "ارسال سریع", description: "۲ تا ۴ روز" },
        { id: uid("f"), icon: "shield", title: "ضمانت اصالت", description: "کالای اصل" },
      ],
    },
    schema: [
      {
        type: "array",
        label: "آیتم‌ها",
        path: "items",
        defaultItem: { id: uid("f"), title: "عنوان", description: "" },
        itemFields: [
          { type: "text", label: "عنوان", path: "title" },
          { type: "textarea", label: "توضیح", path: "description" },
        ],
      },
    ],
  },
  {
    type: "faq",
    name: "FAQ",
    nameFa: "سوالات متداول",
    category: "content",
    description: "FAQ",
    icon: "HelpCircle",
    defaultData: {
      title: "سوالات متداول",
      items: [{ id: uid("q"), question: "سوال؟", answer: "پاسخ." }],
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      {
        type: "array",
        label: "سوالات",
        path: "items",
        defaultItem: { id: uid("q"), question: "؟", answer: "" },
        itemFields: [
          { type: "text", label: "سوال", path: "question" },
          { type: "textarea", label: "پاسخ", path: "answer" },
        ],
      },
    ],
  },
];

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return blockRegistry.find((b) => b.type === type);
}

export function createBlockInstance(type: string): {
  id: string;
  type: string;
  data: Record<string, unknown>;
  enabled: boolean;
} {
  const def = getBlockDefinition(type);
  if (!def) throw new Error(`Unknown block type: ${type}`);
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    data: structuredClone(def.defaultData),
    enabled: true,
  };
}

export const categoryLabels: Record<string, string> = {
  header: "هدر",
  footer: "فوتر",
  layout: "چیدمان",
  marketing: "بازاریابی",
  products: "محصولات",
  catalog: "کاتالوگ",
  content: "محتوا",
  forms: "فرم‌ها",
  store: "فروشگاه",
};
