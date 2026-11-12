# PROJECT_CONTEXT — WebSpeed E-Shop

> مرجع اصلی شناخت پروژه. این سند بر اساس بررسی واقعی کد برنچ `master` (کامیت `a77f51f`) نوشته شده است.
> تاریخ بررسی: ۲۰۲۶-۱۱-۱۲. در این مرحله هیچ کدی تغییر نکرده است.

---

## ۱. معرفی و هدف

WebSpeed یک **قالب فروشگاه اینترنتی پوشاک (فارسی/RTL)** است که به‌تدریج به سمت یک **فروشگاه‌ساز با صفحه‌ساز بصری (Visual Page Builder)** حرکت کرده است.
در وضعیت فعلی پروژه یک **اپلیکیشن کاملاً Frontend و بدون Backend** است: تمام داده‌ها mock (فایل‌های `src/data/*`) یا در `localStorage` مرورگر ذخیره می‌شوند.

- برنچ `main` عمداً خالی شده و README آن می‌گوید کل پروژه روی `master` است.
- بیشتر تاریخچه (۱۴۹ کامیت) روی `master` است.

## ۲. تکنولوژی‌ها

| بخش | تکنولوژی |
|---|---|
| فریم‌ورک | Next.js 15 (App Router) — نسخهٔ نصب‌شده 15.5.x |
| UI | React 19 |
| زبان | TypeScript 5 (`strict: true`) |
| استایل | Tailwind CSS 3.4 + CSS Variables (`globals.css`) |
| آیکون | lucide-react |
| کمکی | clsx + tailwind-merge (`cn`) |
| فونت | Vazirmatn (local در `/public/fonts` + fallback از jsDelivr) |
| State | React Context (سبد خرید) + Store دست‌ساز با `useSyncExternalStore` (صفحه‌ساز) |
| ذخیره‌سازی | `localStorage` |
| تست | **وجود ندارد** |
| ESLint | پکیج نصب است ولی **فایل پیکربندی وجود ندارد** |
| Backend / API / DB / Auth | **وجود ندارد** |

`package-lock.json` در ریپو کامیت نشده است.

## ۳. ساختار پوشه‌ها

```
src/
├── app/                      # App Router
│   ├── layout.tsx            # RootLayout: lang=fa, dir=rtl, CartProvider, ShopChrome
│   ├── page.tsx              # خانه → HomePageView (fallback از config + published از localStorage)
│   ├── [...slug]/page.tsx    # Catch-all صفحات CMS منتشرشده (Client Component)
│   ├── products/, products/[slug]/   # لیست و جزئیات محصول (داده mock)
│   ├── cart/, checkout/, login/, profile/, about/, contact/
│   └── admin/
│       ├── layout.tsx        # AdminShell (به‌جز builder و login)
│       ├── page.tsx          # داشبورد (mock)
│       ├── login/            # فرم ورود نمایشی
│       ├── products/, categories/, orders/, customers/   # فقط نمایش داده mock
│       ├── pages/            # مدیریت صفحات (CRUD روی localStorage)
│       ├── theme/            # تنظیمات تم (ذخیره در localStorage، اعمال نمی‌شود)
│       └── builder/[pageId]/ # صفحه‌ساز بصری
├── builder/                  # هستهٔ صفحه‌ساز
│   ├── types.ts              # union تایپ‌شدهٔ قدیمی PageBlock (۱۵ نوع)
│   ├── schema-types.ts       # FieldSchema / BlockDefinition / BlockCategory
│   ├── BlockRenderer.tsx     # نگاشت type → کامپوننت (۵۰ کلید)
│   ├── rendering/PageRenderer.tsx
│   ├── registry/block-registry.ts   # تعریف بلوک‌های قابل افزودن (۱۹ بلوک)
│   ├── store/builder-store.ts       # state + actions + undo/redo
│   ├── repositories/          # PageRepository (interface) + LocalStorage impl + reusable blocks
│   ├── contracts/             # قرارداد JSON صفحه و SEO
│   ├── validation/page-schema.ts    # اعتبارسنجی و migration
│   ├── responsive/            # DeviceContext, VIEWPORTS, visibility
│   ├── theme/design-tokens.ts
│   ├── templates/types.ts
│   ├── utils/style-keys.ts    # copy/paste style
│   └── components/            # Shell, Toolbar, Canvas, CanvasBlock, Library, Navigator, Properties, FieldRenderer, ErrorBoundary
├── blocks/                   # کامپوننت‌های نمایشی بلوک‌ها (hero, product-slider, layout, header, footer, content, forms, ...)
├── components/               # UI فروشگاه (layout, products, cart, checkout, home, ui) و admin (shell, ui)
├── config/home-page.ts       # پیکربندی پیش‌فرض بلوک‌های صفحه خانه
├── context/CartContext.tsx
├── data/                     # products (۲۰ محصول)، categories، store، admin (mock)
├── design-system/tokens.css, styles/admin-tokens.css   # در هیچ‌جا import نشده‌اند
├── lib/                      # utils, page-slug, products-query
└── types/                    # product, cart, order
public/placeholders/*.svg     # تصاویر placeholder
scripts/download-assets.sh    # دانلود فونت‌ها
```

## ۴. معماری

### ۴.۱ Frontend
- همهٔ صفحات مهم **Client Component** هستند (`"use client"`)؛ فقط `products/[slug]`، `profile`، `about` و ریشهٔ خانه Server Component هستند.
- `ShopChrome` بر اساس pathname، برای مسیرهای غیر `/admin` همیشه `AnnouncementBar + Navbar + Footer` ثابت (کدنویسی‌شده) را رندر می‌کند.
- `AdminLayout` برای `/admin/builder*` و `/admin/login` پوسته را حذف می‌کند.

### ۴.۲ Backend
**وجود ندارد.** نه API Route، نه Server Action، نه `middleware.ts`، نه دیتابیس.

### ۴.۳ مدیریت State
- **سبد خرید:** `CartContext` با persist در `localStorage` (`webspeed-cart-v1`).
- **صفحه‌ساز:** store ماژول‌سطح (singleton) با `useSyncExternalStore`؛ هر کامپوننت با selector یک فیلد را می‌خواند. state شامل `page, blocks, selectedBlockId, previewDevice, isPreview, isDirty, saveStatus, past/future (history), clipboard, styleClipboard`.
- **Device:** `DeviceContext` (پیش‌فرض `"desktop"`) — فقط داخل Canvas مقداردهی می‌شود.

### ۴.۴ لایهٔ داده
- `PageRepository` (interface) ← `LocalStoragePageRepository` (کلید `webspeed-pages-v1`). UI فقط به interface وابسته است؛ جایگزینی با API آینده ممکن است.
- مدل سند: `PageDocument { schemaVersion, id, name, slug, type, status, seo?, blocks, publishedBlocks?, ... }`. بلوک: `{ id, type, enabled, data }`.
- Draft/Publish: ویرایش روی `blocks`، انتشار = کپی به `publishedBlocks`.

### ۴.۵ Routing
- مسیرهای ثابت: `/`, `/products`, `/products/[slug]`, `/cart`, `/checkout`, `/login`, `/profile`, `/about`, `/contact`, `/admin/*`.
- `/[...slug]`: صفحات CMS منتشرشده را بر اساس slug از localStorage می‌خواند (فقط سمت کلاینت).
- مسیرهای ثابت بر catch-all اولویت دارند.

## ۵. وضعیت قابلیت‌های صفحه‌ساز

| قابلیت | وضعیت | توضیح |
|---|---|---|
| **Visual Page Builder** | ✅ پیاده‌سازی، 🟡 ناقص | Shell سه‌ستونه (Library/Layers – Canvas – Properties)، حالت موبایل با drawer. |
| **Block Registry** | 🟡 ناقص | `block-registry.ts` فقط **۱۹** تعریف دارد، در حالی که `BlockRenderer` **۵۰** کامپوننت می‌شناسد. بلوک‌های layout (section/columns/container/stack)، promo-banner، flash-sale، brand-slider، testimonials، newsletter و … در کتابخانه نیستند. دستهٔ `"forms"` در تایپ `BlockCategory` نیست ← **خطای TypeScript و شکست build**. |
| **Block Settings (Properties)** | 🟡 ناقص | فرم schema-driven با گروه‌بندی؛ انواع text/textarea/number/responsiveNumber/boolean/select/color/image/array. فیلدهای `visibility` و `spacing` رندر نمی‌شوند. بلوکی که در registry نیست قابل ویرایش نیست (پنل به «تنظیمات صفحه» برمی‌گردد) — یعنی ۵ بلوک از ۱۲ بلوک خانه. اسلایدهای Hero، دسته‌های category-grid، source/columns محصولات قابل ویرایش نیستند. آیتم‌های array قابل مرتب‌سازی نیستند. |
| **Canvas و Preview** | ✅ | رندر بلوک‌های واقعی فروشگاه داخل فریم با scale؛ حالت پیش‌نمایش. Navbar/Footer فروشگاه در Canvas نیست ⇒ پیش‌نمایش با فروشگاه واقعی متفاوت است. |
| **Drag & Drop** | 🟡 حداقلی | HTML5 native فقط برای مرتب‌سازی بلوک‌های سطح اول. بدون نشانگر محل drop، بدون drag از کتابخانه، بدون پشتیبانی لمسی، بدون nesting. |
| **Responsive Preview** | 🟡 ناقص | فریم 1280/768/390px، ولی چون iframe نیست، کلاس‌های `sm:/md:/lg:` Tailwind بر اساس viewport مرورگر عمل می‌کنند؛ با CSS `!important` وصله شده (مثلاً همهٔ `.grid`ها در موبایل تک‌ستونه می‌شوند). |
| **Visibility per device** | 🔴 فقط در builder | `BlockRenderer` از `usePreviewDevice()` استفاده می‌کند که در Storefront همیشه `"desktop"` است ⇒ مخفی‌سازی موبایل/تبلت و مقادیر responsive در سایت واقعی اعمال **نمی‌شوند**. |
| **Undo / Redo** | ✅ کار می‌کند | تا ۵۰ snapshot؛ Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z. مشکل: هر کلید تایپ یک snapshot است؛ تغییرات Page Meta در history نیستند؛ Ctrl+Z داخل input هم undo بلوک را اجرا می‌کند. |
| **Autosave** | ✅ با مشکل | ۱ ثانیه بعد از dirty شدن (throttle، نه debounce). خطای ذخیره در Toolbar نمایش داده نمی‌شود. اگر یک slug تکراری شود، autosave مدام شکست می‌خورد. |
| **Draft / Publish** | ✅ با باگ | Publish = save + کپی به publishedBlocks. **`validatePage` فیلد `seo` را حذف می‌کند ⇒ SEO هرگز ذخیره نمی‌شود** (در مرورگر تأیید شد). `unpublish` تغییرات ذخیره‌نشده را بدون ذخیره، clean علامت می‌زند. تأیید/مقایسهٔ draft و published وجود ندارد. |
| **PageRenderer / BlockRenderer** | ✅ | مشترک بین Builder و Storefront؛ بلوک ناشناخته پیام خطا می‌دهد؛ ErrorBoundary فقط در Canvas (در Storefront نه). |
| **Storefront** | 🟡 | خانه از published خوانده می‌شود (بعد از mount — اول fallback رندر می‌شود ⇒ پرش محتوا). صفحات سفارشی از `/[...slug]`. صفحات about/contact ثابت‌اند؛ ویرایش آن‌ها در builder اثری ندارد. Metadata/SEO برای صفحات CMS تولید نمی‌شود (client-only). |
| **Layout و Sidebar (Builder)** | ✅ | CSS Grid با سه حالت عرض (<768 / <1100 / ≥1100). دکمهٔ «بلوک‌ها» در Toolbar بین 768 تا 1024px کاری نمی‌کند. |
| **Layers / Navigator** | ✅ ساده | لیست تخت، جابجایی/تکرار/حذف/مخفی‌سازی موبایل. |
| **Copy/Paste بلوک و استایل** | ✅ | از طریق کیبورد و پنل. |
| **Lock / Rename** | 🔴 فقط در store | action دارند ولی UI ندارند. |
| **Nested blocks** | 🔴 | رندر `data.children` در Layout blocks وجود دارد، ولی UI یا action برای افزودن فرزند وجود ندارد و `NestingRules` استفاده نمی‌شود. |
| **Reusable blocks / Templates / Theme tokens** | 🔴 کد مرده | Repository و تایپ‌ها هستند ولی در UI استفاده نمی‌شوند؛ تم ذخیره می‌شود ولی روی فروشگاه اعمال نمی‌شود. |
| **Header/Footer قابل ویرایش** | 🔴 ناهماهنگ | بلوک header/footer وجود دارد ولی Storefront همیشه Navbar/Footer ثابت را هم رندر می‌کند ⇒ افزودن آن‌ها هدر/فوتر دوتایی می‌سازد. |
| **Media library / آپلود تصویر** | 🔴 | فیلد image فقط URL متنی است. |

## ۶. وضعیت محصول (فروشگاه‌ساز)

| حوزه | وضعیت |
|---|---|
| Backend | ❌ وجود ندارد |
| احراز هویت ادمین | ❌ فرم نمایشی؛ هر ایمیل/رمزی پذیرفته می‌شود و `/admin` بدون ورود هم باز است. متن صفحهٔ ورود به‌صورت `و...` نمایش داده می‌شود (escape در JSX). |
| احراز هویت مشتری | ❌ OTP نمایشی؛ هر کد ۴رقمی قبول و `ws_user` در localStorage ذخیره می‌شود. پروفایل داده ثابت نشان می‌دهد. |
| چند فروشگاه (multi-tenant) | ❌ مفهومی وجود ندارد |
| مدیریت محصول/دسته/سفارش/مشتری | ❌ فقط نمایش mock؛ دکمه‌ها غیرفعال |
| مدیریت صفحات | ✅ ایجاد/تکرار/حذف/انتشار روی localStorage؛ اعتبارسنجی slug در مودال ایجاد. ویرایش slug در Builder از قوانین reserved عبور می‌کند. تکرار دوباره یک صفحه slug تکراری می‌سازد. |
| ذخیره‌سازی | فقط localStorage (محدود به همان مرورگر؛ ~5MB؛ برای کاربران دیگر قابل مشاهده نیست) |
| انتشار صفحات | فقط در همان مرورگر قابل مشاهده است؛ SSR/SEO ندارد |
| اتصال Builder ↔ Storefront | ✅ از طریق `PageRenderer` مشترک و `publishedBlocks`؛ با محدودیت‌های بالا |
| Checkout | نمایشی: فرم + آپلود رسید (فقط در state)؛ سفارشی ذخیره یا ارسال نمی‌شود |
| توسعه‌پذیری بلوک‌ها | متوسط: افزودن بلوک نیاز به تغییر **سه** جا دارد: کامپوننت در `src/blocks`، ثبت در `BlockRenderer.tsx`، تعریف در `block-registry.ts` (و اختیاری در union `types.ts`). منبع واحد برای تعریف بلوک وجود ندارد. |

## ۷. مشکلات شناسایی‌شده (همه با بررسی کد؛ موارد ★ در مرورگر هم تأیید شد)

### بحرانی
1. **Build شکست می‌خورد**: `category: "forms"` در `block-registry.ts` (خطوط 229/247/265/283) با `BlockCategory` سازگار نیست. `next build` متوقف می‌شود. ★
2. **SEO صفحه ذخیره نمی‌شود**: `validatePage` در `validation/page-schema.ts` فیلد `seo` را در خروجی نمی‌آورد. ★
3. **بلوک‌های بدون تعریف در registry قابل ویرایش نیستند** (promo-banner, flash-sale, brand-slider, testimonials, newsletter در خانه). ★
4. **Visibility و Responsive values در Storefront اعمال نمی‌شوند** (DeviceContext پیش‌فرض desktop).
5. **عدم وجود Auth و Backend**: پنل ادمین برای همه باز است.
6. **تصاویر**: `/placeholders/samsung-banner.webp` در ۲۸ ارجاع (محصولات، بلوک‌ها) استفاده شده ولی فایل وجود ندارد ⇒ اکثر تصاویر شکسته‌اند (۳۸ از ۴۷ در خانه). ★ پوشهٔ `public/fonts` هم وجود ندارد (fallback به CDN).

### مهم
7. متن‌های `\uXXXX` داخل JSX text به‌صورت خام نمایش داده می‌شوند: `app/admin/login/page.tsx` (عنوان، برچسب‌ها، دکمه، placeholder) و `QuoteBlock`/`VideoBlock` در `blocks/content/ContentBlocks.tsx`. ★
8. `defaultItem.id` در registry (features, faq) یک‌بار در زمان load ماژول ساخته می‌شود ⇒ آیتم‌های جدید id تکراری و React key تکراری می‌گیرند.
9. `duplicatePage` slug یکتا نمی‌سازد (`/x-copy` دوبار) و بدون بررسی clash می‌نویسد ⇒ ذخیرهٔ بعدی هر دو صفحه خطا می‌دهد.
10. `endsAt` فلش‌سیل هنگام load ماژول محاسبه و در seed ذخیره می‌شود ⇒ پس از ۲۸ ساعت تایمر برای همیشه صفر است.
11. Header/Footer بلوکی + Navbar/Footer ثابت ⇒ دوتایی.
12. صفحات about/contact در لیست صفحات هستند ولی route ثابت دارند ⇒ ویرایش بی‌اثر.
13. `loadPage("home")` اگر بلوک‌ها خالی باشند، config پیش‌فرض را برمی‌گرداند و ذخیره می‌کند ⇒ امکان خالی کردن عمدی خانه نیست.
14. وضعیت `error` ذخیره در Toolbar نمایش داده نمی‌شود؛ Publish/Unpublish/Delete بلوک تأیید ندارند (حذف با Backspace).
15. Race در autosave: تغییرات حین ذخیره با `isDirty:false` پوشانده می‌شوند (پنجرهٔ کوچک چون localStorage همزمان است، با API جدی می‌شود).

### معماری و کیفیت کد
16. سه منبع جدا برای تعریف بلوک (`types.ts` union ۱۵تایی، `BlockRenderer` ۵۰تایی، `block-registry` ۱۹تایی) و castهای زیاد `as unknown as PageBlock`.
17. کد مرده: `reusable-blocks-repository`, `templates/types`, `withVisibility`, `loadTheme/saveTheme`, `design-system/tokens.css`, `styles/admin-tokens.css`, `components/admin/AdminSidebar.tsx` (deprecated), actionهای `setBlockLocked/renameBlock/insertBlocks`, `EMPTY_SEO`.
18. استایل‌ها: رنگ‌های hard-code (`#111`, `#E5EAEF`, …) و inline style فراوان؛ دو سیستم توکن موازی.
19. Store صفحه‌ساز: هر `setState` کل لیست را `structuredClone` می‌کند و هر کلید تایپ یک snapshot history است ⇒ برای صفحات بزرگ کند.
20. همهٔ Storefront client-side است؛ خانه ابتدا fallback و سپس published را رندر می‌کند (layout shift، SEO ضعیف).
21. ESLint پیکربندی ندارد (`next lint` حالت تعاملی می‌خواهد)؛ `package-lock.json` کامیت نشده.
22. **تست: هیچ تستی (unit/e2e) و هیچ CI وجود ندارد.**

### امنیت
23. URLهای ورودی کاربر (href، iframe `src` در VideoBlock، image) بدون sanitize رندر می‌شوند ⇒ با وجود backend چندکاربره، `javascript:` URL به Stored XSS تبدیل می‌شود.
24. آپلود رسید فقط سمت کلاینت (بدون محدودیت واقعی)؛ اطلاعات «کاربر لاگین» در localStorage قابل جعل است.
25. پیکربندی `images.dangerouslyAllowSVG` با CSP محدود — قابل قبول ولی باید با منبع تصاویر واقعی بازبینی شود.

### Responsive
26. Canvas بدون iframe ⇒ breakpointهای Tailwind واقعی نیستند؛ وصلهٔ CSS همهٔ gridهای موبایل را تک‌ستونه می‌کند (حتی گرید ۲ستونهٔ محصولات).
27. `DividerBlock` با `w-full` + `mx-*` ممکن است overflow افقی بدهد.

## ۸. تصمیمات معماری موجود

- **Repository Pattern** برای جداسازی ذخیره‌سازی از UI (آماده برای جایگزینی با API).
- **قرارداد JSON سریال‌پذیر** برای صفحه (`schemaVersion` + migration).
- **Draft/Published جدا** در یک سند (`blocks` / `publishedBlocks`).
- **Renderer مشترک** بین Builder و Storefront (بدون نسخهٔ تکراری بلوک‌ها).
- **Schema-driven Properties**: فرم تنظیمات از `FieldSchema` ساخته می‌شود.
- **Store بدون وابستگی خارجی** (`useSyncExternalStore`) به‌جای Zustand/Redux.
- **RTL-first** و فارسی؛ فونت Vazirmatn.
- متادیتای داخلی بلوک با پیشوند `_` در `data` (`_visibility`, `_locked`, `_label`).

## ۹. کارهای باقی‌مانده (خلاصه)

- رفع خطای build و باگ‌های بحرانی (SEO، ویرایش‌پذیری بلوک‌ها، escape متن‌ها، تصاویر).
- یکپارچه‌سازی تعریف بلوک (یک registry واحد: schema + defaultData + component).
- اعمال visibility/responsive در Storefront (CSS media query یا کلاس‌های `hidden md:block` به‌جای Context).
- Canvas مبتنی بر iframe برای Responsive Preview واقعی.
- Drag & Drop کامل (از کتابخانه، نشانگر drop، لمسی، nesting) — مثلاً با dnd-kit.
- Backend: API + دیتابیس + احراز هویت + نقش‌ها + multi-store + media storage.
- Storefront سمت سرور (SSR/ISR) با Metadata برای صفحات CMS.
- اتصال Header/Footer و Theme به Storefront؛ UI برای lock/rename/reusable/templates.
- مدیریت واقعی محصول/سفارش/مشتری و Checkout با ثبت سفارش.
- ESLint، تست (Vitest + Playwright)، CI، lockfile.

## ۱۰. پیشنهاد مراحل بعدی (به ترتیب اولویت)

1. **پایداری (Quick wins):** رفع `"forms"` و سبز کردن build؛ حفظ `seo` در `validatePage`؛ رفع `\u` در JSX؛ id یکتا برای array items؛ slug یکتا در duplicate؛ افزودن placeholder تصویر موجود؛ نمایش خطای ذخیره.
2. **یکپارچگی Block System:** registry واحد و ثبت همهٔ بلوک‌های رندرشدنی (از جمله بلوک‌های خانه) با schema کامل.
3. **Responsive واقعی:** visibility در Storefront + Canvas مبتنی بر iframe.
4. **تجربهٔ ویرایش:** DnD کامل، history هوشمند (coalesce تایپ)، تأیید عملیات خطرناک، Header/Footer سراسری.
5. **زیرساخت کیفیت:** ESLint، lockfile، تست واحد برای store/validation/repository، تست e2e برای builder→publish→storefront، CI.
6. **Backend و Auth:** پیاده‌سازی `PageRepository` روی API (مثلاً Next Route Handlers یا سرویس جدا) + DB + احراز هویت ادمین + middleware محافظ.
7. **تبدیل به فروشگاه‌ساز:** multi-store، media library، مدیریت محصول/سفارش، Checkout واقعی، SSR و SEO.
