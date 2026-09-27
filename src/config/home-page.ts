import type { PageConfig } from "@/builder/types";

/**
 * Home page composition — pure config.
 * Store owners / future CMS can rearrange blocks without touching UI code.
 */
export const homePageConfig: PageConfig = {
  id: "home",
  slug: "/",
  title: "WebSpeed — فروشگاه آنلاین",
  description: "خرید آنلاین پوشاک، الکترونیک و کالاهای روزمره با ارسال سریع",
  blocks: [
    {
      id: "hero-main",
      type: "hero",
      data: {
        autoplay: true,
        intervalMs: 5500,
        slides: [
          {
            id: "s1",
            image: "/placeholders/hero-1.svg",
            eyebrow: "مجموعه جدید",
            title: "فصل تازه، استایل تازه",
            subtitle: "کیفیت بدون مصالحه — برای هر روز زندگی",
            ctaLabel: "مشاهده محصولات",
            ctaHref: "/products?sort=newest",
            align: "right",
          },
          {
            id: "s2",
            image: "/placeholders/hero-2.svg",
            eyebrow: "پیشنهاد ویژه",
            title: "تا ۴۰٪ تخفیف فصلی",
            subtitle: "روی منتخب پوشاک و اکسسوری",
            ctaLabel: "خرید با تخفیف",
            ctaHref: "/products?sort=price-asc",
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
          {
            id: "f1",
            icon: "truck",
            title: "ارسال سریع",
            description: "۲ تا ۴ روز کاری",
          },
          {
            id: "f2",
            icon: "shield",
            title: "ضمانت اصالت",
            description: "کالای اصل و معتبر",
          },
          {
            id: "f3",
            icon: "refresh",
            title: "۷ روز بازگشت",
            description: "بدون سوال اضافه",
          },
          {
            id: "f4",
            icon: "headset",
            title: "پشتیبانی",
            description: "شنبه تا پنجشنبه",
          },
        ],
      },
    },
    {
      id: "cats",
      type: "category-grid",
      data: {
        title: "خرید بر اساس دسته",
        subtitle: "دسته‌بندی‌های محبوب",
        columns: 4,
        categories: [
          {
            id: "c1",
            name: "تی‌شرت",
            slug: "tshirt",
            image: "/placeholders/cat-1.svg",
            count: 24,
          },
          {
            id: "c2",
            name: "هودی",
            slug: "hoodie",
            image: "/placeholders/cat-2.svg",
            count: 18,
          },
          {
            id: "c3",
            name: "شلوار",
            slug: "pants",
            image: "/placeholders/cat-3.svg",
            count: 32,
          },
          {
            id: "c4",
            name: "اکسسوری",
            slug: "accessories",
            image: "/placeholders/cat-4.svg",
            count: 15,
          },
        ],
      },
    },
    {
      id: "featured",
      type: "product-slider",
      data: {
        title: "پیشنهادهای ویژه",
        subtitle: "منتخب تیم WebSpeed",
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
        subtitle: "تا ۳۰٪ تخفیف روی کالکشن پاییز",
        image: "/placeholders/banner-1.svg",
        ctaLabel: "مشاهده پیشنهادها",
        ctaHref: "/products",
        variant: "full",
      },
    },
    {
      id: "new-arrivals",
      type: "product-slider",
      data: {
        title: "تازه‌رسیده‌ها",
        subtitle: "جدیدترین محصولات",
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
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
        limit: 6,
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
            text: "کیفیت پارچه عالی بود و ارسال خیلی سریع انجام شد.",
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
            text: "تجربه خرید راحت بود و پشتیبانی پاسخگو بود.",
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
        title: "از تازه‌ها باخبر شوید",
        subtitle: "تخفیف‌ها و محصولات جدید را در ایمیل دریافت کنید",
        placeholder: "ایمیل شما",
        buttonLabel: "عضویت",
      },
    },
  ],
};
