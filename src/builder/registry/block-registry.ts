import type { BlockDefinition } from "@/builder/schema-types";

const PLACEHOLDER = "/placeholders/samsung-banner.webp";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const blockRegistry: BlockDefinition[] = [
  {
    type: "hero",
    name: "Hero Banner",
    nameFa: "بنر اصلی",
    category: "marketing",
    description: "اسلایدر بزرگ صفحه اول",
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
          subtitle: "توضیح کوتاه بنر",
          ctaLabel: "مشاهده",
          ctaHref: "/products",
          align: "right",
        },
      ],
    },
    schema: [
      { type: "boolean", label: "پخش خودکار", path: "autoplay" },
      { type: "number", label: "فاصله اسلاید (ms)", path: "intervalMs", min: 2000, max: 15000 },
      {
        type: "array",
        label: "اسلایدها",
        path: "slides",
        defaultItem: {
          id: uid("slide"),
          image: PLACEHOLDER,
          eyebrow: "",
          title: "اسلاید جدید",
          subtitle: "",
          ctaLabel: "مشاهده",
          ctaHref: "/products",
          align: "right",
        },
        itemFields: [
          { type: "text", label: "عنوان", path: "title" },
          { type: "text", label: "زیرعنوان", path: "subtitle" },
          { type: "text", label: "برچسب بالا", path: "eyebrow" },
          { type: "image", label: "تصویر", path: "image" },
          { type: "text", label: "متن دکمه", path: "ctaLabel" },
          { type: "url", label: "لینک دکمه", path: "ctaHref" },
          {
            type: "select",
            label: "تراز",
            path: "align",
            options: [
              { label: "راست", value: "right" },
              { label: "وسط", value: "center" },
              { label: "چپ", value: "left" },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "promo-banner",
    name: "Promo Banner",
    nameFa: "بنر تبلیغاتی",
    category: "marketing",
    description: "بنر کمپین و پیشنهاد ویژه",
    icon: "Megaphone",
    defaultData: {
      title: "پیشنهاد ویژه",
      subtitle: "تا ۴۰٪ تخفیف",
      image: PLACEHOLDER,
      ctaLabel: "خرید کنید",
      ctaHref: "/products?discount=1",
      variant: "full",
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      { type: "textarea", label: "زیرعنوان", path: "subtitle" },
      { type: "image", label: "تصویر", path: "image" },
      { type: "text", label: "متن دکمه", path: "ctaLabel" },
      { type: "url", label: "لینک دکمه", path: "ctaHref" },
    ],
  },
  {
    type: "product-slider",
    name: "Product Slider",
    nameFa: "اسلایدر محصولات",
    category: "products",
    description: "نمایش افقی محصولات",
    icon: "LayoutList",
    defaultData: {
      title: "محصولات منتخب",
      subtitle: "",
      source: "featured",
      limit: 8,
      viewAllHref: "/products",
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      { type: "text", label: "زیرعنوان", path: "subtitle" },
      {
        type: "select",
        label: "منبع محصولات",
        path: "source",
        options: [
          { label: "ویژه", value: "featured" },
          { label: "جدید", value: "new" },
          { label: "پرفروش", value: "bestsellers" },
          { label: "همه", value: "all" },
        ],
      },
      { type: "number", label: "تعداد", path: "limit", min: 2, max: 16 },
      { type: "url", label: "لینک مشاهده همه", path: "viewAllHref" },
    ],
  },
  {
    type: "product-grid",
    name: "Product Grid",
    nameFa: "گرید محصولات",
    category: "products",
    description: "شبکه محصولات",
    icon: "LayoutGrid",
    defaultData: {
      title: "محصولات",
      source: "all",
      limit: 8,
      columns: 4,
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      {
        type: "select",
        label: "منبع",
        path: "source",
        options: [
          { label: "ویژه", value: "featured" },
          { label: "جدید", value: "new" },
          { label: "پرفروش", value: "bestsellers" },
          { label: "همه", value: "all" },
        ],
      },
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
      subtitle: "",
      columns: 4,
      categories: [
        { id: uid("cat"), name: "تی‌شرت", slug: "t-shirts", image: PLACEHOLDER, count: 12 },
        { id: uid("cat"), name: "هودی", slug: "hoodies", image: PLACEHOLDER, count: 8 },
      ],
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      { type: "text", label: "زیرعنوان", path: "subtitle" },
    ],
  },
  {
    type: "features",
    name: "Features",
    nameFa: "ویژگی‌ها",
    category: "store",
    description: "ارسال، ضمانت و پشتیبانی",
    icon: "Shield",
    defaultData: {
      items: [
        { id: uid("f"), icon: "truck", title: "ارسال سریع", description: "۲ تا ۴ روز کاری" },
        { id: uid("f"), icon: "shield", title: "ضمانت اصالت", description: "کالای اصل" },
      ],
    },
    schema: [
      {
        type: "array",
        label: "آیتم‌ها",
        path: "items",
        defaultItem: { id: uid("f"), icon: "truck", title: "عنوان", description: "توضیح" },
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
    description: "پرسش و پاسخ",
    icon: "HelpCircle",
    defaultData: {
      title: "سوالات متداول",
      items: [{ id: uid("q"), question: "سوال نمونه؟", answer: "پاسخ نمونه." }],
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      {
        type: "array",
        label: "سوالات",
        path: "items",
        defaultItem: { id: uid("q"), question: "سوال جدید؟", answer: "پاسخ..." },
        itemFields: [
          { type: "text", label: "سوال", path: "question" },
          { type: "textarea", label: "پاسخ", path: "answer" },
        ],
      },
    ],
  },
  {
    type: "newsletter",
    name: "Newsletter",
    nameFa: "خبرنامه",
    category: "store",
    description: "عضویت در خبرنامه",
    icon: "Mail",
    defaultData: {
      title: "عضویت در خبرنامه",
      subtitle: "از تخفیف‌ها جا نمانید",
      placeholder: "ایمیل شما",
      buttonLabel: "عضویت",
    },
    schema: [
      { type: "text", label: "عنوان", path: "title" },
      { type: "textarea", label: "زیرعنوان", path: "subtitle" },
      { type: "text", label: "placeholder", path: "placeholder" },
      { type: "text", label: "متن دکمه", path: "buttonLabel" },
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
  marketing: "بازاریابی",
  products: "محصولات",
  catalog: "کاتالوگ",
  content: "محتوا",
  store: "فروشگاه",
};
