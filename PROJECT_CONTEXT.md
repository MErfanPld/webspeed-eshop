# PROJECT_CONTEXT — WebSpeed

> مرجع اصلی شناخت پروژه. مطابق وضعیت کد روی برنچ `claude/webspeed-project-discovery-audit-su6pr0` (برگرفته از `master`).
> آخرین به‌روزرسانی: پایان مراحل ۱ تا ۷ نقشه راه.

---

## ۱. معرفی و هدف

WebSpeed یک **فروشگاه‌ساز فارسی/RTL** است: هر فروشگاه صفحاتش را با **صفحه‌ساز بصری** می‌سازد، محصول و دسته تعریف می‌کند، سفارش (پرداخت کارت‌به‌کارت با آپلود رسید) دریافت و مدیریت می‌کند و می‌تواند روی دامنه اختصاصی اجرا شود.

## ۲. تکنولوژی‌ها

| بخش | تکنولوژی |
|---|---|
| فریم‌ورک | Next.js 15 (App Router، Route Handlers، Middleware) |
| UI | React 19، Tailwind CSS 3، lucide-react |
| زبان | TypeScript (strict) |
| دیتابیس | SQLite با ماژول داخلی Node (`node:sqlite`، Node ≥ 22.13) — بدون وابستگی native |
| احراز هویت | scrypt + کوکی امضاشده HMAC (Web Crypto) + جدول sessions |
| تست | Vitest (واحد)، Playwright (E2E روی بیلد production) |
| کیفیت | ESLint (flat config، next/core-web-vitals + typescript)، GitHub Actions |

## ۳. معماری

```
مرورگر ──► middleware.ts (بررسی امضای کوکی برای /admin و /api/admin)
   │
   ├── (shop)  فروشگاه — Server Components
   │      layout: تشخیص فروشگاه از Host → هدر/فوتر منتشرشده + کاتالوگ
   │      صفحات: خانه، /[...slug] (CMS)، محصولات، سبد، تسویه، /track
   │
   ├── /admin  پنل — layout سروری (کاربر، فروشگاه فعال، کاتالوگ) + صفحات
   │      /admin/builder/[pageId]  صفحه‌ساز (Client)
   │
   └── /api    Route Handlers ──► src/server/services/* ──► SQLite (DATA_DIR)
```

### لایه‌ها
- **`src/server/`** — فقط سمت سرور (`server-only`):
  - `db.ts` اتصال SQLite، `migrations.ts` مایگریشن نسخه‌دار (`PRAGMA user_version`)، `seed.ts` داده اولیه.
  - `auth/` توکن (`token.ts` — مشترک با middleware)، رمز عبور، نشست.
  - `http.ts` خطاهای HTTP، `adminRoute`/`publicRoute`، بررسی Origin (CSRF)، نقش‌ها.
  - `services/` — `pages`, `stores`, `catalog`, `orders`, `media`.
- **`src/builder/`** — صفحه‌ساز:
  - `registry/block-definitions.ts` **منبع واحد** تعریف بلوک‌ها (داده خالص، قابل استفاده در سرور).
  - `registry/block-components.tsx` نگاشت نوع → کامپوننت با تایپ `Record<BlockTypeKey, View>` (نبود هر طرف = خطای کامپایل).
  - `store/builder-store.ts` (useSyncExternalStore) + `store/tree.ts` (عملیات درختی خالص).
  - `components/` Shell، Toolbar، Canvas (iframe)، CanvasBlock، Library، Navigator، Properties، FieldRenderer، MediaPicker.
  - `dnd/drag-state.ts` منطق Drag & Drop؛ `hooks/shortcuts.ts` میانبرها.
  - `repositories/` اینترفیس `PageRepository` + پیاده‌سازی HTTP.
  - `responsive/css.ts` مقادیر responsive با CSS Variables + media query.
- **`src/blocks/`** کامپوننت‌های نمایشی بلوک‌ها (مشترک بین فروشگاه و صفحه‌ساز).

### مدل داده (SQLite)
`stores` · `users` · `store_members(role: owner|admin|editor)` · `sessions` · `pages(store_id, id, slug, type, status, doc JSON)` · `products` · `categories` · `media` · `orders`.
همه داده‌های فروشگاه با `store_id` جدا شده‌اند. فایل‌ها: `DATA_DIR/media/<store>/` (عمومی) و `DATA_DIR/receipts/<store>/` (خصوصی).

### سند صفحه
`PageDocument { schemaVersion, id, name, slug, type, status, seo, blocks, publishedBlocks, ... }`
- `type`: `home | landing | content | custom | header | footer` (header/footer = قالب سراسری با slug داخلی `/_layout/...`، غیرقابل مسیریابی).
- بلوک: `{ id, type, enabled, data }`؛ فرزندان در `data.children`؛ متادیتای داخلی با `_` (`_visibility`, `_style`, `_anchor`, `_locked`, `_label`).
- ذخیره پیش‌نویس هرگز `publishedBlocks` را تغییر نمی‌دهد؛ فقط Publish/Unpublish.

## ۴. ساختار پوشه‌ها

```
src/
├── app/(shop)/            فروشگاه (SSR) + not-found
├── app/admin/             داشبورد، محصولات، دسته‌ها، سفارش‌ها، مشتری‌ها، صفحات، رسانه، تم، تنظیمات، فروشگاه‌ها، builder
├── app/api/               auth/*, admin/{pages,products,categories,orders,media,store}, orders, orders/track, pages, media/[store]/[id]
├── builder/               هسته صفحه‌ساز
├── blocks/                بلوک‌ها
├── components/            UI فروشگاه، پنل (shell/products/orders/catalog/media/stores)، ConfirmDialog
├── context/               Cart، Catalog، StoreInfo، AdminSession
├── server/                بک‌اند
├── lib/                   page-slug، safe-url، products-query، media-client
└── middleware.ts
tests/unit                 ۱۵۸ تست واحد
tests/e2e                  ۱۰ تست E2E
```

## ۵. قابلیت‌های پیاده‌سازی‌شده

### صفحه‌ساز
- **Block Registry واحد** با ۵۰ نوع بلوک (هدر، فوتر، چیدمان، بازاریابی، محصولات، کاتالوگ، محتوا، فروشگاه، فرم‌ها)، schema کامل برای همه، فیلدهای مشترک (فاصله responsive، پس‌زمینه، anchor).
- **فیلدها**: متن، متن بلند، لینک، عدد، عدد responsive، سوییچ، انتخاب، رنگ، تصویر (+کتابخانه رسانه)، تاریخ/ساعت، انتخاب محصول، آرایه (جمع‌شونده، مرتب‌سازی، حذف).
- **Canvas مبتنی بر iframe**: عرض واقعی ۱۲۸۰/۷۶۸/۳۹۰px؛ breakpointهای Tailwind و media queryها مثل دستگاه واقعی؛ پیش‌نمایش هدر/فوتر سراسری.
- **Drag & Drop**: کتابخانه → بوم، جابه‌جایی، ورود/خروج از کانتینرها (تا عمق ۴)، نشانگر محل رها کردن، ناحیه رها در کانتینر خالی و انتهای صفحه؛ درخت لایه‌ها قابل کشیدن. روی لمسی: کلیک برای افزودن کنار انتخاب + دکمه بالا/پایین.
- **Undo/Redo** ۱۰۰ مرحله، ادغام تایپ پیاپی یک فیلد در یک مرحله، شامل تنظیمات صفحه.
- **Autosave** debounce یک‌ثانیه‌ای، نمایش خطای ذخیره، هشدار خروج با تغییرات ذخیره‌نشده.
- **Draft/Publish/Unpublish** با تأیید؛ قفل، تغییر نام، فعال/غیرفعال، کپی/پیست بلوک و استایل؛ میانبرهای کیبورد (داخل iframe هم).
- **Visibility per device** با کلاس‌های CSS — در فروشگاه هم اعمال می‌شود.
- **هدر/فوتر سراسری** قابل ویرایش در صفحه‌ساز؛ تا انتشار، هدر/فوتر پیش‌فرض نمایش داده می‌شود.

### فروشگاه
- رندر سمت سرور خانه، صفحات CMS، صفحه محصول (+JSON-LD) با `generateMetadata` از SEO صفحه.
- «درباره ما» و «تماس» با انتشار صفحه هم‌آدرس در صفحه‌ساز جایگزین می‌شوند.
- لیست محصولات با فیلتر/مرتب‌سازی از کاتالوگ واقعی، سبد خرید، **Checkout واقعی** (محاسبه قیمت/ارسال در سرور، بررسی تنوع و موجودی، رزرو موجودی، رسید خصوصی)، **پیگیری سفارش** (شماره + موبایل).
- چندفروشگاهی: انتخاب فروشگاه بر اساس دامنه، وگرنه فروشگاه پیش‌فرض.

### پنل مدیریت
- ورود/خروج واقعی، محافظت با middleware + بررسی نشست در دیتابیس و نقش در هر API.
- داشبورد با آمار واقعی، محصولات (CRUD کامل با تصویر/تنوع/وضعیت)، دسته‌ها، سفارش‌ها (فیلتر، جزئیات، رسید، تغییر وضعیت با برگشت موجودی در لغو)، مشتری‌ها (از روی سفارش‌ها)، صفحات، رسانه، تنظیمات فروشگاه (تماس، کارت، ارسال)، فروشگاه‌ها (ساخت/تعویض).

### امنیت
- scrypt، کوکی httpOnly/SameSite=Lax، نشست قابل ابطال، rate limit ورود/سفارش/پیگیری، بررسی Origin برای درخواست‌های تغییردهنده.
- پاک‌سازی URLهای ناامن (`javascript:`, `data:`, `//host`) در داده بلوک‌ها/محصولات؛ embed فقط https.
- آپلود: تشخیص نوع با magic bytes، بدون SVG، حداکثر ۵MB؛ سرو با `nosniff` و CSP؛ رسیدها فقط برای ادمین.
- اعتبارسنجی slug و انواع بلوک در سرور؛ جداسازی کامل داده فروشگاه‌ها.

### کیفیت
- `npm run lint` / `typecheck` / `test` / `test:e2e` / `build` همگی سبز (به‌صورت محلی اجرا شده‌اند).
- CI: `.github/workflows/ci.yml` (کیفیت → E2E). اجرای آن روی GitHub در این جلسه بررسی نشده است.

## ۶. قابلیت‌های ناقص / باقی‌مانده

| مورد | وضعیت |
|---|---|
| **تم سراسری** (`/admin/theme`) | هنوز در localStorage ذخیره می‌شود و روی فروشگاه اعمال **نمی‌شود** |
| **حساب مشتری** (`/login`، `/profile`) | نمایشی (OTP و سفارش‌های ساختگی)؛ مشتری‌ها فقط از روی سفارش‌ها شناخته می‌شوند |
| مدیریت اعضای تیم | هر فروشگاه فقط سازنده‌اش (owner) را دارد؛ دعوت عضو/تغییر نقش UI ندارد |
| تغییر رمز عبور | API/UI ندارد |
| برندها، تخفیف‌ها | در منو غیرفعال |
| درگاه پرداخت آنلاین، پیامک/ایمیل اطلاع‌رسانی | وجود ندارد (فقط کارت‌به‌کارت) |
| بلوک‌های قابل استفاده مجدد / قالب‌های آماده صفحه | فقط تایپ (`builder/templates/types.ts`) |
| Drag & Drop لمسی | HTML5 DnD روی موبایل کار نمی‌کند؛ جایگزین: کلیک برای افزودن + دکمه‌های جابه‌جایی |
| نظرات محصول | داده ثابت محصول؛ ثبت نظر وجود ندارد |
| فونت محلی | `public/fonts` خالی است (اسکریپت `scripts/download-assets.sh`)؛ از CDN بارگذاری می‌شود |
| مقیاس‌پذیری | تک‌نمونه‌ای: SQLite و rate limiter درون‌حافظه‌ای؛ برای چندنمونه، Postgres/Redis لازم است |
| کد بدون استفاده | `src/design-system/tokens.css`، `src/styles/admin-tokens.css`، `builder/templates/types.ts`، `builder/contracts/seo-contract.ts`، `builder/responsive/visibility-schema.ts` |

## ۷. تصمیمات معماری

1. **SQLite داخلی Node** به‌جای سرویس دیتابیس جدا: نصب صفر، مناسب تک‌سرور؛ سرویس‌ها پشت توابع `*Service` هستند تا تعویض به Postgres محدود به `server/` باشد.
2. **Repository در کلاینت** (`PageRepository`) — صفحه‌ساز فقط به اینترفیس وابسته است.
3. **Registry داده‌محور + نگاشت تایپ‌شده کامپوننت‌ها** — سرور بدون React بلوک‌ها را اعتبارسنجی می‌کند.
4. **Responsive با CSS** به‌جای Context — یک کد برای فروشگاه و صفحه‌ساز؛ iframe برای breakpointهای واقعی.
5. **Route group `(shop)`** — فروشگاه و پنل layout و فروشگاه فعال جدا دارند (Host در فروشگاه، کوکی `ws_store` در پنل).
6. **قیمت‌گذاری فقط در سرور** — کلاینت تنها شناسه/تنوع/تعداد می‌فرستد.
7. **Draft/Published در یک سند** با snapshot جدا.

## ۸. پیکربندی و اجرا

متغیرها در `.env.example`: `AUTH_SECRET` (الزامی در production)، `ADMIN_EMAIL`/`ADMIN_PASSWORD`، `DATA_DIR`، `SITE_URL`، `DEFAULT_STORE_SLUG`.
حساب پیش‌فرض توسعه: `admin@webspeed.local` / `admin12345`. در production بدون `ADMIN_PASSWORD` رمز تصادفی ساخته و یک‌بار در لاگ چاپ می‌شود.

## ۹. افزودن بلوک جدید

1. کامپوننت را در `src/blocks/...` بسازید (`{ block }: { block: PageBlock }`؛ برای فرزندان از `<BlockChildren parent={block} />`).
2. تعریف را به `block-definitions.ts` اضافه کنید (type، nameFa، category، icon، defaultData، schema، و برای کانتینر `nesting`).
3. در `block-components.tsx` نگاشت کنید — اگر فراموش شود، TypeScript خطا می‌دهد.
4. تست `block-registry.test.ts` خودکار instance پیش‌فرض و schema را بررسی می‌کند.

## ۱۰. پیشنهاد مراحل بعدی

1. **تم سراسری روی دیتابیس** و اعمال آن با CSS Variables در فروشگاه و Canvas.
2. **حساب مشتری واقعی** (OTP پیامکی) و تاریخچه سفارش از دیتابیس؛ اطلاع‌رسانی پیامک/ایمیل تغییر وضعیت سفارش.
3. **تیم و دسترسی‌ها**: دعوت عضو، تغییر نقش، تغییر/بازیابی رمز.
4. **درگاه پرداخت آنلاین** کنار کارت‌به‌کارت.
5. **قالب‌های آماده و بلوک‌های قابل استفاده مجدد** در صفحه‌ساز؛ DnD لمسی (Pointer Events).
6. **آماده‌سازی استقرار**: Dockerfile با volume برای `DATA_DIR`، پشتیبان‌گیری دیتابیس، و در صورت نیاز به چندنمونه، مهاجرت به Postgres + Redis.
7. پاک‌سازی کدهای بدون استفاده (بخش ۶).
