# WebSpeed — فروشگاه‌ساز با صفحه‌ساز بصری

فروشگاه‌ساز فارسی/RTL با صفحه‌ساز بصری، پنل مدیریت، چندفروشگاهی، کتابخانه رسانه، مدیریت محصول و سفارش و پرداخت کارت‌به‌کارت.
ساخته‌شده با Next.js (App Router)، React 19، TypeScript، Tailwind CSS و SQLite (ماژول داخلی `node:sqlite`).

برای شناخت کامل معماری و وضعیت پروژه، فایل [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) را ببینید.

## پیش‌نیازها

- Node.js **22.13 یا بالاتر** (برای `node:sqlite`)

## اجرا (توسعه)

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
- پنل مدیریت: http://localhost:3000/admin — حساب پیش‌فرض توسعه: `admin@webspeed.local` / `admin12345` (یا مقادیر `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

دیتابیس، رسانه‌ها و رسیدها در `DATA_DIR` (پیش‌فرض `./data`) ساخته می‌شوند و در اولین اجرا با داده نمونه پر می‌شوند.

## اجرا (Production)

```bash
npm ci
```

```bash
npm run build
```

```bash
AUTH_SECRET="<random ≥32 chars>" ADMIN_PASSWORD="<strong password>" DATA_DIR=/var/lib/webspeed npm start
```

- `AUTH_SECRET` در production الزامی است.
- `DATA_DIR` باید یک مسیر دائمی و قابل نوشتن باشد (در Docker/Kubernetes یک volume).
- برنامه برای اجرای **تک‌نمونه‌ای (single node)** طراحی شده است (SQLite و rate limiter درون‌حافظه‌ای).

## اسکریپت‌ها

| دستور | کار |
|---|---|
| `npm run dev` | سرور توسعه |
| `npm run build` / `npm start` | بیلد و اجرای production |
| `npm run lint` | ESLint |
| `npm run typecheck` | بررسی TypeScript |
| `npm test` | تست‌های واحد (Vitest) |
| `npm run test:e2e` | تست‌های E2E (Playwright، روی بیلد production؛ اول `npm run build`) |

## ساختار کلی

```
src/
├── app/(shop)/        # فروشگاه (SSR): خانه، صفحات CMS، محصولات، سبد، تسویه، پیگیری سفارش
├── app/admin/         # پنل مدیریت و صفحه‌ساز
├── app/api/           # API: auth، admin/*، orders، pages، media
├── builder/           # هسته صفحه‌ساز (registry، store، canvas، DnD، رندر)
├── blocks/            # کامپوننت‌های نمایشی بلوک‌ها
├── server/            # دیتابیس، مایگریشن، سرویس‌ها، احراز هویت
└── middleware.ts      # محافظت از /admin و /api/admin
tests/unit, tests/e2e  # تست‌ها
```

## لایسنس

Private — WebSpeed
