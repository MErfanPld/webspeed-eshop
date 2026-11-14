/**
 * Block Definitions — single source of truth for every block type.
 * -----------------------------------------------------------------
 * Pure data (no React) so it can be imported by the server (API validation),
 * the builder UI (library + properties) and tests.
 *
 * The React component for each type is bound in `block-components.tsx`,
 * whose map is typed as `Record<BlockTypeKey, …>` — TypeScript fails the
 * build if a definition has no component or a component has no definition.
 */
import type {
  BlockCategory,
  BlockDefinition,
  FieldSchema,
  SelectOption,
} from "@/builder/schema-types";

const IMG_BANNER = "/placeholders/banner-1.svg";
const IMG_HERO = "/placeholders/hero-1.svg";
const IMG_CAT = "/placeholders/cat-1.svg";
const IMG_BRAND = "/placeholders/brand-1.svg";
const IMG_AVATAR = "/placeholders/avatar.svg";

/* ------------------------------------------------------------------ */
/* Field helpers                                                       */
/* ------------------------------------------------------------------ */

const text = (label: string, path: string, group?: string): FieldSchema => ({ type: "text", label, path, group });
const textarea = (label: string, path: string, group?: string): FieldSchema => ({ type: "textarea", label, path, group });
const url = (label: string, path: string, group?: string): FieldSchema => ({ type: "url", label, path, group });
const image = (label: string, path: string, group?: string): FieldSchema => ({ type: "image", label, path, group });
const color = (label: string, path: string, group = "ظاهر"): FieldSchema => ({ type: "color", label, path, group });
const bool = (label: string, path: string, group?: string): FieldSchema => ({ type: "boolean", label, path, group });
const num = (label: string, path: string, min?: number, max?: number, group?: string): FieldSchema => ({ type: "number", label, path, min, max, group });
const rnum = (label: string, path: string, min?: number, max?: number, group = "چیدمان"): FieldSchema => ({ type: "responsiveNumber", label, path, min, max, group, responsive: true });
const select = (label: string, path: string, options: SelectOption[], group?: string): FieldSchema => ({ type: "select", label, path, options, group });
const date = (label: string, path: string, group?: string): FieldSchema => ({ type: "datetime", label, path, group });
const list = (
  label: string,
  path: string,
  itemFields: FieldSchema[],
  defaultItem: Record<string, unknown>,
  group?: string
): FieldSchema => ({ type: "array", label, path, itemFields, defaultItem, group });

const ALIGN: SelectOption[] = [
  { label: "راست", value: "right" },
  { label: "وسط", value: "center" },
  { label: "چپ", value: "left" },
];

const PRODUCT_SOURCE: SelectOption[] = [
  { label: "همه", value: "all" },
  { label: "ویژه", value: "featured" },
  { label: "جدید", value: "new" },
  { label: "پرفروش", value: "bestsellers" },
];

const LINK_ITEM: FieldSchema[] = [text("عنوان", "label"), url("لینک", "href")];

const productFields = (withViewAll: boolean): FieldSchema[] => [
  text("عنوان", "title"),
  ...(withViewAll ? [text("زیرعنوان", "subtitle"), url("لینک مشاهده همه", "viewAllHref")] : []),
  select("منبع محصولات", "source", PRODUCT_SOURCE, "داده"),
  num("تعداد", "limit", 1, 24, "داده"),
  { type: "productIds", label: "محصولات دستی (اختیاری)", path: "productIds", group: "داده", description: "در صورت انتخاب، منبع نادیده گرفته می‌شود." },
];

const CONTAINER_NESTING = { canHaveChildren: true, maxDepth: 4 };

/** Keeps each `type` as a string literal so `BlockTypeKey` is a precise union */
function defineBlocks<const T extends string>(
  defs: Array<Omit<BlockDefinition, "type"> & { type: T }>
) {
  return defs;
}

/* ------------------------------------------------------------------ */
/* Definitions                                                         */
/* ------------------------------------------------------------------ */

const definitions = defineBlocks([
  /* ---------------- Header ---------------- */
  {
    type: "announcement-bar",
    name: "Announcement Bar",
    nameFa: "نوار اعلان",
    category: "header",
    description: "نوار باریک بالای سایت",
    icon: "Megaphone",
    defaultData: {
      text: "ارسال رایگان برای سفارش‌های بالای ۲٬۵۰۰٬۰۰۰ تومان",
      href: "/products",
      background: "#0f172a",
      textColor: "#ffffff",
    },
    schema: [text("متن", "text"), url("لینک", "href"), color("پس‌زمینه", "background"), color("رنگ متن", "textColor")],
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
        { id: "nav-1", label: "خانه", href: "/" },
        { id: "nav-2", label: "مردانه", href: "/products?gender=men" },
        { id: "nav-3", label: "زنانه", href: "/products?gender=women" },
        { id: "nav-4", label: "درباره ما", href: "/about" },
      ],
    },
    schema: [
      text("لوگو", "logoText", "برند"),
      color("پس‌زمینه", "background"),
      color("رنگ متن", "textColor"),
      color("رنگ حاشیه", "borderColor"),
      bool("چسبان (Sticky)", "sticky", "رفتار"),
      bool("جستجو", "showSearch", "اقدامات"),
      bool("سبد خرید", "showCart", "اقدامات"),
      bool("حساب کاربری", "showAccount", "اقدامات"),
      bool("علاقه‌مندی", "showWishlist", "اقدامات"),
      bool("دکمه CTA", "showCta", "اقدامات"),
      text("متن CTA", "ctaLabel", "اقدامات"),
      url("لینک CTA", "ctaHref", "اقدامات"),
      list("منو", "navItems", LINK_ITEM, { label: "لینک", href: "/" }, "منو"),
    ],
  },

  /* ---------------- Footer ---------------- */
  {
    type: "footer",
    name: "Footer",
    nameFa: "فوتر",
    category: "footer",
    description: "پاورقی با ستون لینک، تماس و شبکه‌های اجتماعی",
    icon: "PanelBottom",
    defaultData: {
      brand: "WebSpeed",
      description: "فروشگاه اینترنتی پوشاک مینیمال.",
      phone: "021-12345678",
      email: "info@webspeed.ir",
      address: "تهران",
      showNewsletter: true,
      newsletterTitle: "خبرنامه",
      newsletterPlaceholder: "ایمیل شما",
      background: "#0f172a",
      textColor: "#f8fafc",
      copyright: "© 2026 WebSpeed",
      columns: [
        {
          id: "col-1",
          title: "فروشگاه",
          links: [
            { id: "l-1", label: "محصولات", href: "/products" },
            { id: "l-2", label: "مردانه", href: "/products?gender=men" },
          ],
        },
        {
          id: "col-2",
          title: "پشتیبانی",
          links: [
            { id: "l-3", label: "تماس", href: "/contact" },
            { id: "l-4", label: "درباره", href: "/about" },
          ],
        },
      ],
      socials: [
        { id: "s-1", label: "اینستاگرام", href: "#" },
        { id: "s-2", label: "تلگرام", href: "#" },
      ],
    },
    schema: [
      text("برند", "brand", "برند"),
      textarea("توضیح", "description", "برند"),
      text("تلفن", "phone", "تماس"),
      text("ایمیل", "email", "تماس"),
      text("آدرس", "address", "تماس"),
      bool("نمایش خبرنامه", "showNewsletter", "خبرنامه"),
      text("عنوان خبرنامه", "newsletterTitle", "خبرنامه"),
      text("Placeholder خبرنامه", "newsletterPlaceholder", "خبرنامه"),
      color("پس‌زمینه", "background"),
      color("رنگ متن", "textColor"),
      text("کپی‌رایت", "copyright"),
      list(
        "ستون‌ها",
        "columns",
        [text("عنوان", "title"), list("لینک‌ها", "links", LINK_ITEM, { label: "لینک", href: "/" })],
        { title: "ستون", links: [] },
        "لینک‌ها"
      ),
      list("شبکه‌های اجتماعی", "socials", LINK_ITEM, { label: "شبکه", href: "#" }, "لینک‌ها"),
    ],
  },

  /* ---------------- Layout ---------------- */
  {
    type: "section",
    name: "Section",
    nameFa: "سکشن",
    category: "layout",
    description: "بخش تمام‌عرض با پس‌زمینه و فاصله",
    icon: "RectangleHorizontal",
    defaultData: { paddingY: { desktop: 48, mobile: 24 }, background: "transparent", children: [] },
    schema: [rnum("فاصله عمودی", "paddingY", 0, 240), color("پس‌زمینه", "background")],
    nesting: CONTAINER_NESTING,
  },
  {
    type: "container",
    name: "Container",
    nameFa: "کانتینر",
    category: "layout",
    description: "محدود کردن عرض محتوا",
    icon: "Square",
    defaultData: { maxWidth: 1280, children: [] },
    schema: [rnum("حداکثر عرض", "maxWidth", 320, 1920)],
    nesting: CONTAINER_NESTING,
  },
  {
    type: "columns",
    name: "Columns",
    nameFa: "ستون‌ها",
    category: "layout",
    description: "چیدمان چندستونه واکنش‌گرا",
    icon: "Columns3",
    defaultData: { columns: { desktop: 2, tablet: 2, mobile: 1 }, gap: 24, children: [] },
    schema: [rnum("تعداد ستون", "columns", 1, 6), rnum("فاصله", "gap", 0, 96)],
    nesting: CONTAINER_NESTING,
  },
  {
    type: "stack",
    name: "Stack",
    nameFa: "پشته عمودی",
    category: "layout",
    description: "چیدمان عمودی با فاصله",
    icon: "Rows3",
    defaultData: { gap: 16, children: [] },
    schema: [rnum("فاصله", "gap", 0, 96)],
    nesting: CONTAINER_NESTING,
  },
  {
    type: "grid",
    name: "Grid",
    nameFa: "گرید",
    category: "layout",
    description: "شبکه با تعداد ستون ثابت",
    icon: "LayoutGrid",
    defaultData: { columns: { desktop: 3, tablet: 2, mobile: 1 }, gap: 16, children: [] },
    schema: [rnum("تعداد ستون", "columns", 1, 6), rnum("فاصله", "gap", 0, 96)],
    nesting: CONTAINER_NESTING,
  },
  {
    type: "flex",
    name: "Flex Row",
    nameFa: "ردیف افقی",
    category: "layout",
    description: "چیدمان افقی",
    icon: "Columns2",
    defaultData: { gap: 16, justify: "flex-start", align: "center", children: [] },
    schema: [
      rnum("فاصله", "gap", 0, 96),
      select("چینش افقی", "justify", [
        { label: "شروع", value: "flex-start" },
        { label: "وسط", value: "center" },
        { label: "پایان", value: "flex-end" },
        { label: "فاصله‌دار", value: "space-between" },
      ]),
      select("چینش عمودی", "align", [
        { label: "بالا", value: "flex-start" },
        { label: "وسط", value: "center" },
        { label: "پایین", value: "flex-end" },
      ]),
    ],
    nesting: CONTAINER_NESTING,
  },
  {
    type: "spacer",
    name: "Spacer",
    nameFa: "فاصله‌گذار",
    category: "layout",
    description: "فضای خالی",
    icon: "MoveVertical",
    defaultData: { height: { desktop: 48, mobile: 24 } },
    schema: [rnum("ارتفاع", "height", 4, 320)],
  },
  {
    type: "divider",
    name: "Divider",
    nameFa: "جداکننده",
    category: "layout",
    description: "خط افقی",
    icon: "Minus",
    defaultData: { color: "#E8E8E8", thickness: 1 },
    schema: [color("رنگ", "color"), num("ضخامت", "thickness", 1, 12, "ظاهر")],
  },

  /* ---------------- Marketing ---------------- */
  {
    type: "hero",
    name: "Hero Slider",
    nameFa: "بنر اصلی (اسلایدر)",
    category: "marketing",
    description: "اسلایدر بزرگ با عنوان و دکمه",
    icon: "GalleryHorizontal",
    defaultData: {
      autoplay: true,
      intervalMs: 5000,
      slides: [
        {
          id: "slide-1",
          image: IMG_HERO,
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
      bool("پخش خودکار", "autoplay", "رفتار"),
      num("فاصله اسلایدها (ms)", "intervalMs", 2000, 15000, "رفتار"),
      list(
        "اسلایدها",
        "slides",
        [
          image("تصویر", "image"),
          text("بالای عنوان", "eyebrow"),
          text("عنوان", "title"),
          textarea("زیرعنوان", "subtitle"),
          text("متن دکمه", "ctaLabel"),
          url("لینک دکمه", "ctaHref"),
          select("چینش", "align", ALIGN),
        ],
        { image: IMG_HERO, title: "اسلاید جدید", align: "right" }
      ),
    ],
  },
  {
    type: "promo-banner",
    name: "Promo Banner",
    nameFa: "بنر تبلیغاتی",
    category: "marketing",
    description: "بنر عریض با دکمه",
    icon: "Megaphone",
    defaultData: {
      title: "فروش ویژه",
      subtitle: "تا ۳۰٪ تخفیف",
      image: IMG_BANNER,
      ctaLabel: "مشاهده",
      ctaHref: "/products",
    },
    schema: [text("عنوان", "title"), textarea("زیرعنوان", "subtitle"), image("تصویر", "image"), text("متن دکمه", "ctaLabel"), url("لینک دکمه", "ctaHref")],
  },
  {
    type: "flash-sale",
    name: "Flash Sale",
    nameFa: "فروش فوری",
    category: "marketing",
    description: "شمارش معکوس + محصولات",
    icon: "Timer",
    defaultData: { title: "فروش فوری", endsAt: "", recurring: "daily", limit: 4 },
    schema: [
      text("عنوان", "title"),
      date("زمان پایان", "endsAt", "زمان"),
      select("تکرار", "recurring", [
        { label: "بدون تکرار", value: "none" },
        { label: "روزانه (تا نیمه‌شب)", value: "daily" },
      ], "زمان"),
      num("تعداد محصول", "limit", 1, 12, "داده"),
      { type: "productIds", label: "محصولات (اختیاری)", path: "productIds", group: "داده" },
    ],
  },
  {
    type: "cta",
    name: "Call to Action",
    nameFa: "فراخوان (CTA)",
    category: "marketing",
    description: "عنوان + دکمه",
    icon: "MousePointerClick",
    defaultData: { title: "همین حالا شروع کنید", subtitle: "", buttonLabel: "مشاهده فروشگاه", href: "/products" },
    schema: [text("عنوان", "title"), textarea("زیرعنوان", "subtitle"), text("متن دکمه", "buttonLabel"), url("لینک", "href")],
  },
  {
    type: "countdown",
    name: "Countdown",
    nameFa: "شمارش معکوس",
    category: "marketing",
    description: "تایمر تا یک تاریخ",
    icon: "Hourglass",
    defaultData: { title: "زمان باقی‌مانده", targetDate: "" },
    schema: [text("عنوان", "title"), date("تاریخ هدف", "targetDate")],
  },
  {
    type: "add-to-cart-banner",
    name: "Add to Cart Banner",
    nameFa: "بنر خرید",
    category: "marketing",
    description: "بنر کوچک با دکمه خرید",
    icon: "ShoppingCart",
    defaultData: { title: "محصول ویژه", subtitle: "موجود در انبار", buttonLabel: "افزودن به سبد", href: "/products" },
    schema: [text("عنوان", "title"), text("زیرعنوان", "subtitle"), text("متن دکمه", "buttonLabel"), url("لینک", "href")],
  },

  /* ---------------- Products ---------------- */
  {
    type: "product-grid",
    name: "Product Grid",
    nameFa: "گرید محصولات",
    category: "products",
    description: "شبکه محصولات",
    icon: "LayoutGrid",
    defaultData: { title: "محصولات", source: "all", limit: 8 },
    schema: productFields(false),
  },
  {
    type: "product-slider",
    name: "Product Slider",
    nameFa: "اسلایدر محصولات",
    category: "products",
    description: "نمایش افقی محصولات",
    icon: "GalleryHorizontalEnd",
    defaultData: { title: "محصولات منتخب", source: "featured", limit: 8, viewAllHref: "/products" },
    schema: productFields(true),
  },
  {
    type: "featured-products",
    name: "Featured Products",
    nameFa: "محصولات ویژه",
    category: "products",
    description: "گرید محصولات ویژه",
    icon: "Star",
    defaultData: { title: "محصولات ویژه", source: "featured", limit: 8 },
    schema: productFields(false),
  },
  {
    type: "best-sellers",
    name: "Best Sellers",
    nameFa: "پرفروش‌ها",
    category: "products",
    description: "اسلایدر پرفروش‌ترین‌ها",
    icon: "TrendingUp",
    defaultData: { title: "پرفروش‌ترین‌ها", source: "bestsellers", limit: 8, viewAllHref: "/products?sort=bestsellers" },
    schema: productFields(true),
  },
  {
    type: "new-arrivals",
    name: "New Arrivals",
    nameFa: "تازه‌ها",
    category: "products",
    description: "اسلایدر جدیدترین محصولات",
    icon: "Sparkles",
    defaultData: { title: "تازه‌رسیده‌ها", source: "new", limit: 8, viewAllHref: "/products?sort=newest" },
    schema: productFields(true),
  },
  {
    type: "related-slider",
    name: "Related Products",
    nameFa: "محصولات مرتبط",
    category: "products",
    description: "اسلایدر محصولات انتخابی",
    icon: "GitBranch",
    defaultData: { title: "محصولات مرتبط", productIds: [] },
    schema: [text("عنوان", "title"), { type: "productIds", label: "محصولات", path: "productIds", group: "داده" }],
  },

  /* ---------------- Catalog ---------------- */
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
        { id: "cat-1", name: "تی‌شرت", slug: "t-shirts", image: IMG_CAT, count: 12 },
        { id: "cat-2", name: "هودی", slug: "hoodies", image: "/placeholders/cat-2.svg", count: 8 },
      ],
    },
    schema: [
      text("عنوان", "title"),
      text("زیرعنوان", "subtitle"),
      select("تعداد ستون (دسکتاپ)", "columns", [
        { label: "۲", value: 2 },
        { label: "۳", value: 3 },
        { label: "۴", value: 4 },
        { label: "۶", value: 6 },
      ], "چیدمان"),
      list(
        "دسته‌ها",
        "categories",
        [text("نام", "name"), text("اسلاگ", "slug"), image("تصویر", "image"), num("تعداد", "count", 0)],
        { name: "دسته", slug: "", image: IMG_CAT }
      ),
    ],
  },
  {
    type: "brand-slider",
    name: "Brands",
    nameFa: "برندها",
    category: "catalog",
    description: "لوگوی برندها",
    icon: "Award",
    defaultData: {
      title: "برندهای منتخب",
      brands: [
        { id: "b1", name: "Nova", logo: IMG_BRAND },
        { id: "b2", name: "Aether", logo: "/placeholders/brand-2.svg" },
      ],
    },
    schema: [
      text("عنوان", "title"),
      list("برندها", "brands", [text("نام", "name"), image("لوگو", "logo"), url("لینک", "href")], { name: "برند", logo: IMG_BRAND }),
    ],
  },
  {
    type: "logo-cloud",
    name: "Logo Cloud",
    nameFa: "ابر لوگو",
    category: "catalog",
    description: "نام برندها به‌صورت متنی",
    icon: "Cloud",
    defaultData: {
      title: "مورد اعتماد برندها",
      logos: [
        { id: "lg-1", name: "Brand A" },
        { id: "lg-2", name: "Brand B" },
        { id: "lg-3", name: "Brand C" },
      ],
    },
    schema: [text("عنوان", "title"), list("لوگوها", "logos", [text("نام", "name")], { name: "Brand" })],
  },

  /* ---------------- Content ---------------- */
  {
    type: "heading",
    name: "Heading",
    nameFa: "عنوان",
    category: "content",
    description: "H1–H4",
    icon: "Heading",
    defaultData: { text: "عنوان بخش", level: 2, align: "right" },
    schema: [
      text("متن", "text"),
      select("سطح", "level", [
        { label: "H1", value: 1 },
        { label: "H2", value: 2 },
        { label: "H3", value: 3 },
        { label: "H4", value: 4 },
      ]),
      select("چینش", "align", ALIGN),
    ],
  },
  {
    type: "text",
    name: "Text",
    nameFa: "متن",
    category: "content",
    description: "پاراگراف",
    icon: "Pilcrow",
    defaultData: { text: "متن خود را اینجا بنویسید.", align: "right" },
    schema: [textarea("متن", "text"), select("چینش", "align", ALIGN)],
  },
  {
    type: "rich-text",
    name: "Rich Text",
    nameFa: "متن بلند",
    category: "content",
    description: "متن چندپاراگرافی",
    icon: "FileText",
    defaultData: { body: "پاراگراف اول\n\nپاراگراف دوم" },
    schema: [textarea("متن", "body")],
  },
  {
    type: "button",
    name: "Button",
    nameFa: "دکمه",
    category: "content",
    description: "دکمه لینک‌دار",
    icon: "RectangleEllipsis",
    defaultData: { label: "خرید کنید", href: "/products", variant: "primary", align: "start" },
    schema: [
      text("برچسب", "label"),
      url("لینک", "href"),
      select("نوع", "variant", [
        { label: "اصلی", value: "primary" },
        { label: "ثانویه", value: "secondary" },
        { label: "شفاف", value: "ghost" },
      ]),
      select("چینش", "align", [
        { label: "شروع", value: "start" },
        { label: "وسط", value: "center" },
        { label: "پایان", value: "end" },
      ]),
    ],
  },
  {
    type: "image",
    name: "Image",
    nameFa: "تصویر",
    category: "content",
    description: "تصویر تکی",
    icon: "Image",
    defaultData: { src: IMG_BANNER, alt: "" },
    schema: [image("تصویر", "src"), text("متن جایگزین (Alt)", "alt")],
  },
  {
    type: "video",
    name: "Video",
    nameFa: "ویدیو",
    category: "content",
    description: "ویدیو embed (YouTube/Aparat)",
    icon: "Video",
    defaultData: { url: "", title: "ویدیو" },
    schema: [url("آدرس embed", "url"), text("عنوان", "title")],
  },
  {
    type: "badge",
    name: "Badge",
    nameFa: "نشان",
    category: "content",
    description: "برچسب کوچک",
    icon: "BadgeCheck",
    defaultData: { text: "جدید" },
    schema: [text("متن", "text")],
  },
  {
    type: "quote",
    name: "Quote",
    nameFa: "نقل قول",
    category: "content",
    description: "نقل قول",
    icon: "Quote",
    defaultData: { text: "کیفیت هرگز تصادفی نیست.", author: "" },
    schema: [textarea("متن", "text"), text("گوینده", "author")],
  },
  {
    type: "stats",
    name: "Stats",
    nameFa: "آمار",
    category: "content",
    description: "اعداد کلیدی",
    icon: "ChartNoAxesColumn",
    defaultData: {
      items: [
        { id: "st-1", value: "10k+", label: "مشتری" },
        { id: "st-2", value: "500+", label: "محصول" },
        { id: "st-3", value: "98%", label: "رضایت" },
      ],
    },
    schema: [list("آیتم‌ها", "items", [text("مقدار", "value"), text("برچسب", "label")], { value: "0", label: "برچسب" })],
  },
  {
    type: "faq",
    name: "FAQ",
    nameFa: "سوالات متداول",
    category: "content",
    description: "پرسش و پاسخ",
    icon: "HelpCircle",
    defaultData: { title: "سوالات متداول", items: [{ id: "q-1", question: "سوال؟", answer: "پاسخ." }] },
    schema: [text("عنوان", "title"), list("سوالات", "items", [text("سوال", "question"), textarea("پاسخ", "answer")], { question: "سوال؟", answer: "" })],
  },
  {
    type: "accordion",
    name: "Accordion",
    nameFa: "آکاردئون",
    category: "content",
    description: "بخش‌های بازشونده",
    icon: "ListCollapse",
    defaultData: { title: "", items: [{ id: "ac-1", q: "عنوان", a: "محتوا" }] },
    schema: [text("عنوان", "title"), list("آیتم‌ها", "items", [text("عنوان", "q"), textarea("محتوا", "a")], { q: "عنوان", a: "" })],
  },
  {
    type: "tabs",
    name: "Tabs",
    nameFa: "تب‌ها",
    category: "content",
    description: "محتوای تب‌بندی‌شده",
    icon: "PanelsTopLeft",
    defaultData: {
      tabs: [
        { id: "tb-1", label: "توضیحات", content: "محتوای تب اول" },
        { id: "tb-2", label: "مشخصات", content: "محتوای تب دوم" },
      ],
    },
    schema: [list("تب‌ها", "tabs", [text("عنوان", "label"), textarea("محتوا", "content")], { label: "تب", content: "" })],
  },
  {
    type: "breadcrumbs",
    name: "Breadcrumbs",
    nameFa: "مسیر صفحه",
    category: "content",
    description: "Breadcrumb",
    icon: "ChevronsLeft",
    defaultData: {
      items: [
        { id: "bc-1", label: "خانه", href: "/" },
        { id: "bc-2", label: "صفحه", href: "" },
      ],
    },
    schema: [list("آیتم‌ها", "items", LINK_ITEM, { label: "صفحه", href: "" })],
  },
  {
    type: "not-found",
    name: "Not Found",
    nameFa: "صفحه ۴۰۴",
    category: "content",
    description: "پیام صفحه یافت نشد",
    icon: "FileX",
    defaultData: { code: "404", message: "صفحه یافت نشد.", ctaLabel: "بازگشت به خانه", ctaHref: "/" },
    schema: [text("کد", "code"), text("پیام", "message"), text("متن دکمه", "ctaLabel"), url("لینک دکمه", "ctaHref")],
  },

  /* ---------------- Store / trust ---------------- */
  {
    type: "features",
    name: "Features",
    nameFa: "ویژگی‌ها",
    category: "store",
    description: "ارسال سریع، ضمانت، ...",
    icon: "Shield",
    defaultData: {
      items: [
        { id: "f-1", icon: "truck", title: "ارسال سریع", description: "۲ تا ۴ روز" },
        { id: "f-2", icon: "shield", title: "ضمانت اصالت", description: "کالای اصل" },
      ],
    },
    schema: [
      list(
        "آیتم‌ها",
        "items",
        [
          select("آیکون", "icon", [
            { label: "ارسال", value: "truck" },
            { label: "ضمانت", value: "shield" },
            { label: "بازگشت", value: "refresh" },
            { label: "پشتیبانی", value: "headset" },
            { label: "پرداخت", value: "card" },
          ]),
          text("عنوان", "title"),
          textarea("توضیح", "description"),
        ],
        { icon: "truck", title: "عنوان", description: "" }
      ),
    ],
  },
  {
    type: "trust-badges",
    name: "Trust Badges",
    nameFa: "نشان‌های اعتماد",
    category: "store",
    description: "نمادهای اعتماد",
    icon: "ShieldCheck",
    defaultData: {
      items: [
        { id: "tr-1", title: "نماد اعتماد", description: "" },
        { id: "tr-2", title: "پرداخت امن", description: "" },
      ],
    },
    schema: [list("آیتم‌ها", "items", [text("عنوان", "title"), text("توضیح", "description")], { title: "عنوان" })],
  },
  {
    type: "icon-list",
    name: "Icon List",
    nameFa: "لیست با آیکون",
    category: "store",
    description: "لیست مزایا",
    icon: "ListChecks",
    defaultData: {
      items: [
        { id: "il-1", title: "ارسال رایگان", text: "برای خریدهای بالای ۲.۵ میلیون" },
        { id: "il-2", title: "بازگشت ۷ روزه", text: "" },
      ],
    },
    schema: [list("آیتم‌ها", "items", [text("عنوان", "title"), text("متن", "text")], { title: "عنوان", text: "" })],
  },
  {
    type: "testimonials",
    name: "Testimonials",
    nameFa: "نظر مشتریان",
    category: "store",
    description: "نقل قول مشتریان با امتیاز",
    icon: "MessageSquareQuote",
    defaultData: {
      title: "نظر مشتریان",
      items: [{ id: "t-1", name: "سارا م.", role: "تهران", rating: 5, text: "خیلی راضی بودم.", avatar: IMG_AVATAR }],
    },
    schema: [
      text("عنوان", "title"),
      list(
        "نظرات",
        "items",
        [text("نام", "name"), text("نقش/شهر", "role"), num("امتیاز", "rating", 1, 5), textarea("متن", "text"), image("آواتار", "avatar")],
        { name: "مشتری", rating: 5, text: "", avatar: IMG_AVATAR }
      ),
    ],
  },
  {
    type: "reviews",
    name: "Reviews",
    nameFa: "دیدگاه‌ها",
    category: "store",
    description: "کارت‌های دیدگاه",
    icon: "Star",
    defaultData: {
      title: "دیدگاه خریداران",
      items: [
        { id: "rv-1", name: "علی", text: "کیفیت عالی.", rating: 5 },
        { id: "rv-2", name: "مریم", text: "ارسال سریع.", rating: 4 },
      ],
    },
    schema: [text("عنوان", "title"), list("دیدگاه‌ها", "items", [text("نام", "name"), textarea("متن", "text"), num("امتیاز", "rating", 1, 5)], { name: "کاربر", text: "", rating: 5 })],
  },

  /* ---------------- Forms ---------------- */
  {
    type: "newsletter",
    name: "Newsletter",
    nameFa: "خبرنامه (بنر)",
    category: "forms",
    description: "بخش عضویت خبرنامه",
    icon: "Mail",
    defaultData: { title: "از تخفیف‌ها جا نمانید", subtitle: "", placeholder: "ایمیل شما", buttonLabel: "عضویت" },
    schema: [text("عنوان", "title"), textarea("زیرعنوان", "subtitle"), text("Placeholder", "placeholder"), text("دکمه", "buttonLabel")],
  },
  {
    type: "newsletter-form",
    name: "Newsletter Form",
    nameFa: "فرم خبرنامه",
    category: "forms",
    description: "فرم ساده خبرنامه",
    icon: "MailPlus",
    defaultData: { title: "عضویت در خبرنامه", subtitle: "", placeholder: "ایمیل شما", buttonLabel: "عضویت" },
    schema: [text("عنوان", "title"), text("زیرعنوان", "subtitle"), text("Placeholder", "placeholder"), text("دکمه", "buttonLabel")],
  },
  {
    type: "contact-form",
    name: "Contact Form",
    nameFa: "فرم تماس",
    category: "forms",
    description: "فرم تماس با فیلدهای قابل تنظیم",
    icon: "Send",
    defaultData: {
      title: "تماس با ما",
      subtitle: "پیام خود را برای ما بفرستید",
      buttonLabel: "ارسال پیام",
      fields: [
        { id: "cf-1", label: "نام", name: "name", type: "text", placeholder: "نام شما", required: true },
        { id: "cf-2", label: "ایمیل", name: "email", type: "email", placeholder: "email@example.com", required: true },
        { id: "cf-3", label: "پیام", name: "message", type: "textarea", placeholder: "متن پیام...", required: true },
      ],
    },
    schema: [
      text("عنوان", "title"),
      text("زیرعنوان", "subtitle"),
      text("دکمه", "buttonLabel"),
      list(
        "فیلدها",
        "fields",
        [
          text("برچسب", "label"),
          text("نام فیلد", "name"),
          select("نوع", "type", [
            { label: "متن", value: "text" },
            { label: "ایمیل", value: "email" },
            { label: "تلفن", value: "tel" },
            { label: "متن بلند", value: "textarea" },
          ]),
          text("Placeholder", "placeholder"),
          bool("الزامی", "required"),
        ],
        { label: "فیلد", name: "field", type: "text", required: false },
        "فیلدها"
      ),
    ],
  },
  {
    type: "login-form",
    name: "Login Form",
    nameFa: "فرم ورود",
    category: "forms",
    description: "ورود با موبایل",
    icon: "LogIn",
    defaultData: { title: "ورود / ثبت‌نام", placeholder: "0912xxxxxxx", buttonLabel: "دریافت کد" },
    schema: [text("عنوان", "title"), text("Placeholder", "placeholder"), text("دکمه", "buttonLabel")],
  },
  {
    type: "search-form",
    name: "Search Form",
    nameFa: "فرم جستجو",
    category: "forms",
    description: "جستجوی محصول",
    icon: "Search",
    defaultData: { placeholder: "جستجوی محصول...", buttonLabel: "جستجو" },
    schema: [text("Placeholder", "placeholder"), text("دکمه", "buttonLabel")],
  },
]);

/** Union of every registered block type */
export type BlockTypeKey = (typeof definitions)[number]["type"];

/* ------------------------------------------------------------------ */
/* Common fields appended to every block's Properties panel            */
/* ------------------------------------------------------------------ */

export const COMMON_FIELDS: FieldSchema[] = [
  rnum("فاصله بالا", "_style.marginTop", 0, 240, "پیشرفته"),
  rnum("فاصله پایین", "_style.marginBottom", 0, 240, "پیشرفته"),
  { type: "color", label: "پس‌زمینه بیرونی", path: "_style.background", group: "پیشرفته" },
  { type: "text", label: "شناسه لنگر (anchor)", path: "_anchor", group: "پیشرفته", placeholder: "مثلاً offers" },
];

export const blockDefinitions: readonly BlockDefinition[] = definitions;

const byType = new Map<string, BlockDefinition>(
  blockDefinitions.map((d) => [d.type, d])
);

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return byType.get(type);
}

export function isKnownBlockType(type: string): type is BlockTypeKey {
  return byType.has(type);
}

export function canHaveChildren(type: string): boolean {
  return Boolean(byType.get(type)?.nesting?.canHaveChildren);
}

export const categoryLabels: Record<BlockCategory, string> = {
  header: "هدر",
  footer: "فوتر",
  layout: "چیدمان",
  marketing: "بازاریابی",
  products: "محصولات",
  catalog: "کاتالوگ",
  content: "محتوا",
  forms: "فرم‌ها",
  store: "فروشگاه",
  commerce: "تجارت",
};

/* ------------------------------------------------------------------ */
/* Instances                                                           */
/* ------------------------------------------------------------------ */

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Deep clone and give every nested object that has an `id` a fresh id.
 * Used for new instances, duplicates and paste so ids never collide.
 */
export function regenerateIds<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => regenerateIds(v)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = regenerateIds(v);
    }
    if (typeof out.id === "string") {
      const prefix = typeof out.type === "string" ? out.type : "item";
      out.id = newId(prefix);
    }
    return out as T;
  }
  return value;
}

export type BlockInstance = {
  id: string;
  type: string;
  data: Record<string, unknown>;
  enabled: boolean;
};

export function createBlockInstance(type: string): BlockInstance {
  const def = getBlockDefinition(type);
  if (!def) throw new Error(`Unknown block type: ${type}`);
  return {
    id: newId(type),
    type,
    data: regenerateIds(structuredClone(def.defaultData) as Record<string, unknown>),
    enabled: true,
  };
}
