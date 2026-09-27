import type { PageConfig } from "@/builder/types";

export const homePageConfig: PageConfig = {
  id: "home",
  slug: "/",
  title: "WebSpeed | فروشگاه اینترنتی",
  description: "خرید آنلاین با ارسال سریع و ضمانت اصالت کالا",
  blocks: [
    {
      id: "hero-main",
      type: "hero",
      data: {
        autoplay: true,
        intervalMs: 5000,
        slides: [
          {
            id: "s1",
            image: "/placeholders/hero-1.svg",
            eyebrow: "مجموعه جدید",
            title: "خرید هوشمند، ارسال سریع",
            subtitle: "هزاران محصول اصل با بهترین قیمت و ضمانت اصالت",
            ctaLabel: "مشاهده محصولات",
            ctaHref: "/products?sort=newest",
            align: "right",
          },
          {
            id: "s2",
            image: "/placeholders/hero-2.svg",
            eyebrow: "پیشنهاد ویژه",
            title: "تا ۴۰٪ تخفیف فصلی",
            subtitle: "روی منتخب پوشاک و اکسسوری — فرصت محدود",
            ctaLabel: "خرید با تخفیف",
            ctaHref: "/products?discount=1",
            align: "right",
          },
          {
            id: "s3",
            image: "/placeholders/hero-3.svg",
            eyebrow: "ارسال رایگان",
            title: "سفارش بالای ۲٫۵ میلیون",
            subtitle: "تحویل سریع در سراسر کشور",
            ctaLabel: "شروع خرید",
            ctaHref: "/products",
            align: "center",
          },
        ],
      },
    },
    {
      id: "features-top",
      type: "features",
      data: {
        items: [
          { id: "f1", icon: "truck", title: "ارسال سریع", description: "۲ تا ۴ روز کاری" },
          { id: "f2", icon: "shield", title: "ضمانت اصالت", description: "کالای ۱۰۰٪ اصل" },
          { id: "f3", icon: "refresh", title: "۷ روز بازگشت", description: "بدون شرط اضافه" },
          { id: "f4", icon: "headset", title: "پشتیبانی آنلاین", description: "شنبه تا پنجشنبه" },
        ],
      },
    },
    {
      id: "cats",
      type: "category-grid",
      data: {
        title: "دسته‌بندی‌ها",
        subtitle: "خرید سریع بر اساس نیاز شما",
        columns: 6,
        categories: [
          { id: "c1", name: "تی‌شرت", slug: "t-shirts", image: "/placeholders/cat-1.svg", count: 48 },
          { id: "c2", name: "هودی", slug: "hoodies", image: "/placeholders/cat-2.svg", count: 32 },
          { id: "c3", name: "شلوار", slug: "pants", image: "/placeholders/cat-3.svg", count: 56 },
          { id: "c4", name: "جین", slug: "jeans", image: "/placeholders/cat-4.svg", count: 28 },
          { id: "c5", name: "کت", slug: "jackets", image: "/placeholders/cat-1.svg", count: 22 },
          { id: "c6", name: "اکسسوری", slug: "accessories", image: "/placeholders/cat-2.svg", count: 40 },
        ],
      },
    },
    {
      id: "featured",
      type: "product-slider",
      data: {
        title: "پیشنهاد شگفت‌انگیز",
        subtitle: "منتخب امروز WebSpeed",
        source: "featured",
        limit: 8,
        viewAllHref: "/products?sort=featured",
      },
    },
    {
      id: "promo-1",
      type: "promo-banner",
      data: {
        title: "فروش ویژه آخر هفته",
        subtitle: "تا ۳۰٪ تخفیف روی کالکشن پاییز — فقط تا پایان هفته",
        image: "/placeholders/banner-1.svg",
        ctaLabel: "مشاهده پیشنهادها",
        ctaHref: "/products?discount=1",
        variant: "full",
      },
    },
    {
      id: "bestsellers",
      type: "product-slider",
      data: {
        title: "پرفروش‌ترین‌ها",
        subtitle: "محبوب‌ترین انتخاب مشتریان",
        source: "bestsellers",
        limit: 8,
        viewAllHref: "/products?sort=bestsellers",
      },
    },
    {
      id: "new-arrivals",
      type: "product-slider",
      data: {
        title: "تازه‌رسیده‌ها",
        subtitle: "جدیدترین محصولات فروشگاه",
        source: "new",
        limit: 8,
        viewAllHref: "/products?sort=newest",
      },
    },
    {
      id: "flash",
      type: "flash-sale",
      data: {
        title: "فروش فوری",
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
        limit: 4,
      },
    },
    {
      id: "brands",
      type: "brand-slider",
      data: {
        title: "برندهای منتخب",
        brands: [
          { id: "b1", name: "Nova", logo: "/placeholders/brand-1.svg" },
          { id: "b2", name: "Aether", logo: "/placeholders/brand-2.svg" },
          { id: "b3", name: "Lumen", logo: "/placeholders/brand-3.svg" },
          { id: "b4", name: "Orbit", logo: "/placeholders/brand-4.svg" },
          { id: "b5", name: "Pulse", logo: "/placeholders/brand-1.svg" },
          { id: "b6", name: "Form", logo: "/placeholders/brand-2.svg" },
        ],
      },
    },
    {
      id: "testimonials",
      type: "testimonials",
      data: {
        title: "نظر مشتریان",
        items: [
          {
            id: "t1",
            name: "سارا م.",
            role: "تهران",
            rating: 5,
            text: "ارسال سریع بود و کیفیت کالا دقیقاً مطابق توضیحات سایت.",
            avatar: "/placeholders/avatar.svg",
          },
          {
            id: "t2",
            name: "علی ر.",
            role: "اصفهان",
            rating: 5,
            text: "سایزبندی دقیق و بسته‌بندی مرتب. حتماً دوباره خرید می‌کنم.",
            avatar: "/placeholders/avatar.svg",
          },
          {
            id: "t3",
            name: "مریم ک.",
            role: "شیراز",
            rating: 4,
            text: "پشتیبانی پاسخگو بود و روند خرید خیلی ساده انجام شد.",
            avatar: "/placeholders/avatar.svg",
          },
        ],
      },
    },
    {
      id: "faq",
      type: "faq",
      data: {
        title: "سوالات متداول",
        items: [
          {
            id: "q1",
            question: "زمان ارسال چقدر است؟",
            answer:
              "سفارش‌های تهران معمولاً ۱ تا ۲ روز کاری و شهرستان ۲ تا ۴ روز کاری تحویل داده می‌شوند.",
          },
          {
            id: "q2",
            question: "شرایط بازگشت کالا چیست؟",
            answer:
              "تا ۷ روز پس از دریافت، در صورت سالم بودن کالا و برچسب، امکان بازگشت وجود دارد.",
          },
          {
            id: "q3",
            question: "روش پرداخت چگونه است؟",
            answer:
              "پرداخت به‌صورت کارت‌به‌کارت انجام می‌شود و پس از تأیید رسید، سفارش پردازش می‌گردد.",
          },
        ],
      },
    },
    {
      id: "newsletter",
      type: "newsletter",
      data: {
        title: "از تخفیف‌ها جا نمانید",
        subtitle: "با عضویت در خبرنامه، پیشنهادهای ویژه را زودتر دریافت کنید",
        placeholder: "ایمیل شما",
        buttonLabel: "عضویت",
      },
    },
  ],
};
