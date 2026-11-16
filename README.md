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

## امکانات

| بخش | مسیر |
|---|---|
| داشبورد، محصولات (فیلتر و صفحه‌بندی)، دسته‌ها، برندها | `/admin`، `/admin/products`، `/admin/categories`، `/admin/brands` |
| سفارش‌ها (فیلتر وضعیت/روش پرداخت، جستجو، صفحه‌بندی)، مشتری‌ها | `/admin/orders`، `/admin/customers` |
| کدهای تخفیف، نظرات (تأیید/رد) | `/admin/coupons`، `/admin/reviews` |
| صفحه‌ساز (کشیدن‌ورهاکردن با ماوس و **لمسی**، بلوک‌ها و قالب‌های ذخیره‌شده) | `/admin/pages` → `/admin/builder/<id>` |
| تیم، گزارش فعالیت (فقط مالک)، حساب، بازیابی رمز | `/admin/team`، `/admin/audit`، `/admin/account`، `/admin/forgot-password` |
| **آموزش و راهنما** | `/admin/help` |
| فروشگاه: کد تخفیف، پرداخت کارت‌به‌کارت یا آنلاین، آدرس‌های ذخیره‌شده، نظر خریداران | `/checkout`، `/checkout/result`، `/profile` |
| SEO | `/sitemap.xml`، `/robots.txt`، JSON-LD محصول |

### سرویس‌های پولی در حالت آزمایشی

پیامک، درگاه پرداخت و ایمیل تا زمان خرید در **ترمینال API** نمایش داده می‌شوند (`[SMS → …]`، `[PAYMENT] …`، متن ایمیل). در حالت آزمایشی پرداخت آنلاین به صفحه «درگاه پرداخت آزمایشی» API می‌رود که دو دکمه موفق/ناموفق دارد. فعال‌سازی واقعی فقط با `.env` API است (`SMS_BACKEND=kavenegar`، `PAYMENT_PROVIDER=zarinpal`، SMTP).

### سرعت

- هر داده فروشگاه در یک درخواست فقط یک بار از API خوانده می‌شود (React `cache`) و صفحات کاتالوگ موازی گرفته می‌شوند.
- اسکلت بارگذاری (`loading.tsx`) برای فروشگاه، صفحه محصول و پنل؛ ناوبری بدون صفحه سفید.
- فونت وزیرمتن محلی (`public/fonts`) با preload و کش یک‌ساله؛ تصاویر AVIF/WebP؛ tree-shaking آیکون‌ها.

## Docker

```bash
docker build -t webspeed-web --build-arg API_INTERNAL_URL=http://api:8000/api/v1 .
```

```bash
docker run -p 3000:3000 -e API_INTERNAL_URL=http://api:8000/api/v1 -e SITE_URL=https://shop.example.com webspeed-web
```

بیلد standalone است (`NEXT_OUTPUT=standalone`)؛ چون rewriteهای `/api/v1` هنگام بیلد ثبت می‌شوند، `API_INTERNAL_URL` را به‌عنوان build-arg هم بدهید.

## تست E2E

API را با تنظیمات توسعه اجرا کنید (برای دیدن کد OTP در پاسخ، `OTP_DEV_RETURN_CODE=True` پیش‌فرض development است)، origin تست (`http://localhost:3100`) را در `CORS_ALLOWED_ORIGINS` و `CSRF_TRUSTED_ORIGINS` API بگذارید و برای تست پرداخت `PAYMENT_PROVIDER=mock` و `FRONTEND_URL=http://localhost:3100` را تنظیم کنید، سپس:

```bash
npm run build && npm run test:e2e
```

حساب ادمین تست با `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` (پیش‌فرض `admin@webspeed.local` / `admin12345`).

در CI، job ‏E2E ریپوی API را checkout می‌کند و به secret ‏`API_REPO_TOKEN` (توکن fine-grained با دسترسی خواندن `webspeed-eshop-api`) نیاز دارد.

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
