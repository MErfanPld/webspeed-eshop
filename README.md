# WebSpeed E-Shop

قالب فروشگاه اینترنتی پوشاک مینیمال و قابل شخصی‌سازی — ساخته شده با Next.js App Router، TypeScript و Tailwind CSS.

## ویژگی‌ها

- طراحی مینیمال و editorial الهام‌گرفته از برندهای فشن
- کاملاً Responsive و RTL-ready
- فیلتر و مرتب‌سازی محصولات
- سبد خرید با persistence (localStorage)
- Checkout با پرداخت کارت‌به‌کارت و آپلود رسید
- SEO metadata
- کامپوننت‌های reusable

## اجرا

```bash
npm install
npm run dev
```

سپس به [http://localhost:3000](http://localhost:3000) بروید.

## اسکریپت‌ها

- `npm run dev` — توسعه
- `npm run build` — بیلد production
- `npm start` — اجرای production
- `npm run lint` — ESLint

## ساختار

```
src/
├── app/           # صفحات (App Router)
├── components/    # کامپوننت‌های UI و feature
├── context/       # CartContext
├── data/          # محصولات و اطلاعات فروشگاه (mock)
├── lib/           # utilities
└── types/         # TypeScript types
```

## شخصی‌سازی

- رنگ‌ها: `src/app/globals.css` (`:root` CSS variables)
- اطلاعات فروشگاه: `src/data/store.ts`
- محصولات: `src/data/products.ts`
- دسته‌ها: `src/data/categories.ts`

## لایسنس

Private — WebSpeed Template
