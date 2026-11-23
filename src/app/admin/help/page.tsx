import Link from "next/link";
import type { Metadata } from "next";
import {
  BookOpen,
  CreditCard,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  MessageSquare,
  Package,
  Palette,
  PanelsTopLeft,
  Percent,
  ShoppingBag,
  Terminal,
  UsersRound,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";

export const metadata: Metadata = { title: "آموزش و راهنما" };

type Topic = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  href?: string;
  steps: React.ReactNode[];
  tip?: React.ReactNode;
};

const TOPICS: Topic[] = [
  {
    id: "start",
    icon: LayoutDashboard,
    title: "شروع سریع (۵ دقیقه)",
    href: "/admin",
    steps: [
      <>در «تنظیمات فروشگاه» نام، تلفن، آدرس، شماره کارت و هزینه ارسال را وارد کنید.</>,
      <>در «تم و ظاهر» رنگ‌ها و اندازه متن را با برند خود هماهنگ کنید.</>,
      <>چند دسته‌بندی و برند بسازید، سپس محصولات را اضافه کنید.</>,
      <>در «صفحات» صفحه خانه را با صفحه‌ساز طراحی و «انتشار» کنید.</>,
      <>یک سفارش آزمایشی بگذارید تا کل مسیر خرید را ببینید.</>,
    ],
  },
  {
    id: "products",
    icon: Package,
    title: "محصولات، دسته‌ها و برندها",
    href: "/admin/products",
    steps: [
      <>«افزودن محصول»: نام، اسلاگ انگلیسی (آدرس صفحه)، قیمت، موجودی و تصاویر را وارد کنید.</>,
      <>سایزها و رنگ‌ها را تعریف کنید؛ مشتری هنگام خرید فقط از همین‌ها انتخاب می‌کند.</>,
      <>نام برند را در فرم محصول بنویسید؛ اگر وجود نداشته باشد خودکار ساخته می‌شود. لوگو را از «برندها» اضافه کنید.</>,
      <>وضعیت «پیش‌نویس» محصول را از فروشگاه پنهان می‌کند؛ «فعال» آن را نمایش می‌دهد.</>,
    ],
    tip: <>موجودی هنگام ثبت سفارش کم و با لغو سفارش برگردانده می‌شود؛ نیازی به اصلاح دستی نیست.</>,
  },
  {
    id: "builder",
    icon: PanelsTopLeft,
    title: "صفحه‌ساز",
    href: "/admin/pages",
    steps: [
      <>از «صفحات» یک صفحه را باز کنید. بلوک‌ها را از ستون کناری به بوم بکشید یا روی آن‌ها کلیک کنید.</>,
      <>
        روی موبایل و تبلت: بلوک را <b>کمی نگه دارید</b> و سپس بکشید.
      </>,
      <>با انتخاب هر بلوک، تنظیمات آن در پنل ویژگی‌ها ظاهر می‌شود؛ مقادیر را برای دسکتاپ، تبلت و موبایل جدا تنظیم کنید.</>,
      <>بلوک‌های «ستون» و «بخش» می‌توانند بلوک‌های دیگر را در خود جای دهند.</>,
      <>
        «ذخیره‌شده‌ها و قالب‌ها»: یک بلوک را برای استفاده دوباره ذخیره کنید یا کل صفحه را قالب کنید و روی صفحه
        دیگری اعمال کنید.
      </>,
      <>
        میانبرها: <kbd>Ctrl+Z</kbd> واگرد، <kbd>Ctrl+Shift+Z</kbd> انجام دوباره، <kbd>Ctrl+S</kbd> ذخیره،{" "}
        <kbd>Delete</kbd> حذف بلوک.
      </>,
      <>ذخیره فقط پیش‌نویس را تغییر می‌دهد؛ تا «انتشار» نزنید، مشتری نسخه قبلی را می‌بیند.</>,
    ],
  },
  {
    id: "orders",
    icon: ShoppingBag,
    title: "سفارش‌ها و پرداخت",
    href: "/admin/orders",
    steps: [
      <>کارت‌به‌کارت: مشتری رسید را آپلود می‌کند؛ رسید را در جزئیات سفارش ببینید و سفارش را «تأیید» کنید.</>,
      <>پرداخت آنلاین: سفارش پس از پرداخت موفق خودکار «تأیید شده» می‌شود و در صورت ناموفق بودن لغو می‌گردد.</>,
      <>با هر تغییر وضعیت (تأیید، ارسال، تحویل، لغو) یک پیامک برای مشتری فرستاده می‌شود.</>,
      <>با فیلتر وضعیت و روش پرداخت، و جستجو (شماره سفارش، نام یا موبایل + Enter) سفارش‌ها را پیدا کنید.</>,
    ],
    tip: <>لغو سفارش موجودی را برمی‌گرداند و استفاده از کد تخفیف آن را آزاد می‌کند.</>,
  },
  {
    id: "coupons",
    icon: Percent,
    title: "کدهای تخفیف",
    href: "/admin/coupons",
    steps: [
      <>نوع درصدی (با سقف اختیاری) یا مبلغ ثابت را انتخاب کنید.</>,
      <>حداقل مبلغ سفارش، تعداد کل استفاده، سقف استفاده هر مشتری و بازه زمانی را تعیین کنید.</>,
      <>مشتری کد را در صفحه تسویه حساب وارد می‌کند؛ مبلغ نهایی همیشه روی سرور محاسبه می‌شود.</>,
    ],
  },
  {
    id: "reviews",
    icon: MessageSquare,
    title: "نظرات مشتریان",
    href: "/admin/reviews",
    steps: [
      <>فقط مشتری‌ای که محصول را خریده می‌تواند برای آن نظر بدهد (یک نظر برای هر محصول).</>,
      <>نظرها پس از «تأیید» شما نمایش داده می‌شوند و امتیاز محصول خودکار به‌روز می‌شود.</>,
    ],
  },
  {
    id: "media",
    icon: ImageIcon,
    title: "رسانه",
    href: "/admin/media",
    steps: [
      <>تصاویر PNG، JPG، WEBP یا GIF تا ۵ مگابایت را آپلود کنید.</>,
      <>در فرم‌ها و صفحه‌ساز با دکمه «انتخاب از رسانه» از همین تصاویر استفاده کنید.</>,
    ],
  },
  {
    id: "theme",
    icon: Palette,
    title: "تم و ظاهر",
    href: "/admin/theme",
    steps: [<>رنگ اصلی، تأکیدی، پس‌زمینه و متن را تغییر دهید؛ پیش‌نمایش زنده است و پس از ذخیره روی کل فروشگاه اعمال می‌شود.</>],
  },
  {
    id: "team",
    icon: UsersRound,
    title: "تیم و دسترسی‌ها",
    href: "/admin/team",
    steps: [
      <>
        <b>مالک</b>: همه کارها + مدیریت تیم و «گزارش فعالیت». <b>مدیر</b>: محصولات، سفارش‌ها، تنظیمات.{" "}
        <b>ویرایشگر</b>: فقط محتوا و صفحات.
      </>,
      <>کارهای حساس (حذف محصول، تغییر وضعیت سفارش، کد تخفیف، تغییر تیم) در «گزارش فعالیت» ثبت می‌شوند.</>,
    ],
  },
  {
    id: "account",
    icon: KeyRound,
    title: "حساب و امنیت",
    href: "/admin/account",
    steps: [
      <>رمز عبور را از «حساب و رمز عبور» تغییر دهید؛ همه نشست‌های دیگر بسته می‌شوند.</>,
      <>اگر رمز را فراموش کردید، در صفحه ورود «رمز عبور را فراموش کرده‌اید؟» را بزنید؛ لینک یک‌ساعته ایمیل می‌شود.</>,
    ],
  },
  {
    id: "dev",
    icon: Terminal,
    title: "حالت آزمایشی (سرویس‌های پولی)",
    steps: [
      <>
        تا زمان خرید پنل پیامک، درگاه پرداخت و ایمیل، همه‌چیز در <b>ترمینال API</b> نمایش داده می‌شود:
      </>,
      <>
        پیامک‌ها (کد ورود و وضعیت سفارش): <code dir="ltr">[SMS → 0912…] …</code>
      </>,
      <>
        پرداخت آنلاین: صفحه «درگاه پرداخت آزمایشی» با دو دکمه موفق/ناموفق و لاگ <code dir="ltr">[PAYMENT] …</code>
      </>,
      <>ایمیل بازیابی رمز: متن کامل ایمیل همراه لینک در ترمینال چاپ می‌شود.</>,
      <>
        برای فعال‌سازی واقعی کافی است در فایل <code dir="ltr">.env</code> API مقادیر{" "}
        <code dir="ltr">SMS_BACKEND=kavenegar</code>، <code dir="ltr">PAYMENT_PROVIDER=zarinpal</code> و تنظیمات SMTP را وارد کنید.
      </>,
    ],
  },
];

export default function AdminHelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader
        title="آموزش و راهنما"
        description="هر بخش پنل را در چند قدم یاد بگیرید. روی عنوان هر بخش بزنید تا به همان صفحه بروید."
      />

      <nav aria-label="فهرست راهنما" className="bg-white border border-[#E8E8E8] rounded-2xl p-4">
        <p className="text-xs font-bold text-[#737373] mb-3 inline-flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" /> فهرست
        </p>
        <ul className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#F7F7F7] hover:bg-[#EFEFEF]">
                <t.icon className="h-3.5 w-3.5" /> {t.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-4">
        {TOPICS.map((t) => (
          <section
            key={t.id}
            id={t.id}
            className="bg-white border border-[#E8E8E8] rounded-2xl p-5 scroll-mt-24"
            aria-labelledby={`${t.id}-title`}
          >
            <h2 id={`${t.id}-title`} className="text-base font-semibold text-[#111] flex items-center gap-2 mb-3">
              <span className="h-8 w-8 rounded-lg bg-[#F7F7F7] inline-flex items-center justify-center">
                <t.icon className="h-4 w-4" />
              </span>
              {t.href ? (
                <Link href={t.href} className="hover:underline">
                  {t.title}
                </Link>
              ) : (
                t.title
              )}
            </h2>
            <ol className="list-decimal pr-5 space-y-2 text-sm text-[#404040] leading-7 marker:text-[#A3A3A3]">
              {t.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            {t.tip && (
              <p className="mt-3 text-xs text-[#1D4ED8] bg-[#EFF6FF] rounded-lg px-3 py-2 leading-6">نکته: {t.tip}</p>
            )}
          </section>
        ))}
      </div>

      <section className="bg-gradient-to-l from-[#6d28d9] to-[#db2777] text-white rounded-2xl p-5 flex items-start gap-3">
        <GraduationCap className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="text-sm leading-7">
          <p className="font-semibold">به کمک بیشتری نیاز دارید؟</p>
          <p className="text-white/70">
            مستندات فنی نصب و راه‌اندازی در فایل README هر دو مخزن (فرانت و API) و مستندات API در{" "}
            <code dir="ltr">/api/docs/</code> موجود است.
          </p>
          <p className="text-white/70 mt-1 inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> <CreditCard className="h-3.5 w-3.5" /> پیش از راه‌اندازی واقعی، بخش «حالت آزمایشی» را بخوانید.
          </p>
        </div>
      </section>
    </div>
  );
}
