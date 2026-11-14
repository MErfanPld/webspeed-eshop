# WebSpeed — فرانت‌اند فروشگاه‌ساز (Next.js)

فروشگاه‌ساز فارسی/RTL با صفحه‌ساز بصری، پنل مدیریت، چندفروشگاهی، کتابخانه رسانه، مدیریت محصول و سفارش، تم سراسری، ورود مشتری با کد یک‌بارمصرف و مدیریت تیم.

- **این ریپو:** فقط فرانت‌اند (Next.js 15، React 19، TypeScript، Tailwind). دیتابیس ندارد.
- **بک‌اند:** API جنگو در ریپوی [`webspeed-eshop-api`](https://github.com/MErfanPld/webspeed-eshop-api). همه داده‌ها از آن می‌آید.

## معماری اتصال

```
مرورگر ──► Next.js (localhost:3000)
              ├─ /api/v1/*  ──rewrite──►  Django API (API_INTERNAL_URL)
              ├─ /media/*   ──rewrite──►  Django (فایل‌های محلی در حالت توسعه)
              ├─ صفحات SSR   ──fetch────►  Django (با X-Store-Host و کوکی‌ها)
              └─ middleware: تمدید توکن منقضی‌شده پیش از رندر /admin
```

- `src/lib/api/client.ts` — کلاینت مرورگر: `credentials: "include"`، تمدید خودکار توکن روی 401 (یک درخواست مشترک) و تکرار یک‌باره، خطاهای فارسی، JSON/FormData/فایل.
- `src/lib/api/server.ts` — درخواست‌های سمت سرور مستقیم به `API_INTERNAL_URL`.
- احراز هویت ادمین با کوکی‌های httpOnly ‏`ws_access` / `ws_refresh` که API می‌سازد؛ مشتری با کوکی `ws_customer`.

## پیش‌نیازها

- Node.js 20.9 یا بالاتر (توصیه: 22)
- API جنگو در حال اجرا (راهنمای ریپوی API)

## اجرا

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

- فروشگاه: http://localhost:3000
- پنل: http://localhost:3000/admin (حساب owner ساخته‌شده توسط `manage.py seed` در API)

متغیرها در `.env.example` توضیح داده شده‌اند (`API_INTERNAL_URL`، `NEXT_PUBLIC_API_URL`، `SITE_URL`، `MEDIA_PUBLIC_URLS`).

## اسکریپت‌ها

| دستور | کار |
|---|---|
| `npm run dev` | سرور توسعه |
| `npm run build` / `npm start` | بیلد و اجرای production |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | تست‌های واحد (Vitest) |
| `npm run test:e2e` | تست‌های E2E روی بیلد production و **API واقعی** (اول `npm run build`، API باید روی `API_INTERNAL_URL` بالا باشد) |

## تست E2E

API را با تنظیمات توسعه اجرا کنید (برای دیدن کد OTP در پاسخ، `OTP_DEV_RETURN_CODE=True` پیش‌فرض development است)، origin تست (`http://localhost:3100`) را در `CORS_ALLOWED_ORIGINS` و `CSRF_TRUSTED_ORIGINS` API بگذارید، سپس:

```bash
npm run build && npm run test:e2e
```

حساب ادمین تست با `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` (پیش‌فرض `admin@webspeed.local` / `admin12345`).

## ساختار

```
src/
├── app/(shop)/      فروشگاه (SSR از API)
├── app/admin/       پنل و صفحه‌ساز
├── builder/         هسته صفحه‌ساز
├── blocks/          بلوک‌ها
├── components/      UI
├── context/         Cart، Catalog، StoreInfo، AdminSession
├── lib/api/         کلاینت API (مرورگر/سرور)، داده فروشگاه و پنل
├── lib/theme/       تم فروشگاه → متغیرهای CSS
└── middleware.ts    محافظت و تمدید نشست /admin
```

## لایسنس

Private — WebSpeed
