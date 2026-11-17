import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import {
  BarChart3,
  CreditCard,
  Globe,
  LayoutTemplate,
  MessageSquare,
  MousePointerClick,
  Palette,
  Percent,
  ShieldCheck,
  Smartphone,
  Store,
  Users,
} from "lucide-react";
import Pricing from "@/components/platform/Pricing";
import { platformConfig, type PlatformPlan } from "@/lib/platform";
import { serverApiOrNull } from "@/lib/api/server";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: MousePointerClick, title: "صفحه‌ساز کشیدنی", text: "بیش از ۵۰ بلوک آماده؛ بکشید، رها کنید و برای موبایل و دسکتاپ جدا تنظیم کنید." },
  { icon: Globe, title: "آدرس اختصاصی", text: "هر فروشگاه روی زیردامنه خودش، و در پلن‌های بالاتر روی دامنه شخصی شما." },
  { icon: CreditCard, title: "پرداخت آنلاین و کارت‌به‌کارت", text: "درگاه بانکی یا رسید کارت‌به‌کارت؛ موجودی و مبلغ همیشه روی سرور محاسبه می‌شود." },
  { icon: Percent, title: "کد تخفیف", text: "درصدی یا مبلغ ثابت، با سقف استفاده، حداقل خرید و تاریخ انقضا." },
  { icon: MessageSquare, title: "پیامک سفارش و نظرات", text: "ورود مشتری با کد پیامکی، اطلاع‌رسانی وضعیت سفارش و نظرات تأییدشده خریداران." },
  { icon: Users, title: "تیم و دسترسی‌ها", text: "مالک، مدیر و ویرایشگر؛ با گزارش کامل فعالیت‌های حساس." },
  { icon: Palette, title: "تم و برند", text: "رنگ‌ها و تایپوگرافی فروشگاه را بدون کدنویسی هماهنگ با برندتان کنید." },
  { icon: BarChart3, title: "داشبورد فروش", text: "فروش روزانه، میانگین سفارش، مشتری‌ها و هشدار کمبود موجودی." },
  { icon: ShieldCheck, title: "امن و جدا", text: "داده هر فروشگاه کاملاً جداست؛ رمزنگاری Argon2، نشست امن و محدودیت درخواست." },
];

const STEPS = [
  { icon: Store, title: "ثبت‌نام", text: "نام فروشگاه و آدرس دلخواه را انتخاب کنید." },
  { icon: LayoutTemplate, title: "طراحی", text: "محصولات را اضافه و صفحه اول را با صفحه‌ساز بچینید." },
  { icon: Smartphone, title: "فروش", text: "لینک فروشگاه را به مشتری‌ها بدهید و سفارش بگیرید." },
];

const FAQ = [
  ["آیا برای راه‌اندازی به برنامه‌نویس نیاز دارم؟", "خیر. همه‌چیز از پنل مدیریت و صفحه‌ساز کشیدنی انجام می‌شود."],
  ["دوره رایگان چطور است؟", "بعد از ثبت‌نام همه امکانات پلن انتخابی در دسترس است. پس از پایان دوره، برای ادامه نمایش فروشگاه باید پلن را تمدید کنید؛ اطلاعات شما حذف نمی‌شود."],
  ["می‌توانم دامنه خودم را وصل کنم؟", "بله، در پلن‌های حرفه‌ای و سازمانی. تا آن زمان فروشگاه روی زیردامنه اختصاصی شما فعال است."],
  ["اطلاعات فروشگاه من از بقیه جداست؟", "بله. محصولات، سفارش‌ها، مشتری‌ها و فایل‌های هر فروشگاه کاملاً جدا نگهداری می‌شوند و پنل هر فروشگاه فقط برای تیم همان فروشگاه باز می‌شود."],
  ["بعداً می‌توانم پلن را عوض کنم؟", "بله، هر زمان که بخواهید پلن را ارتقا می‌دهید و محدودیت‌ها بلافاصله برداشته می‌شود."],
];

export default async function PlatformHome() {
  const { base } = platformConfig();
  const plans = (await serverApiOrNull<{ plans: PlatformPlan[] }>("/platform/plans").catch(() => null))?.plans ?? [];
  const trialDays = Number(process.env.TRIAL_DAYS || 14);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_80%_-10%,#ffe4dc,transparent),radial-gradient(40rem_25rem_at_0%_10%,#e0e7ff,transparent)]" />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[#fde2db] text-[#c2410c]">
            {formatNumber(trialDays)} روز رایگان · بدون نیاز به کارت بانکی
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold leading-[1.25] tracking-tight">
            فروشگاه اینترنتی خودتان را
            <br />
            <span className="bg-gradient-to-l from-[#e31b23] to-[#ff7a59] bg-clip-text text-transparent">در چند دقیقه</span> بسازید
          </h1>
          <p className="mt-6 text-lg text-[#475569] max-w-2xl mx-auto leading-9">
            آدرس اختصاصی، صفحه‌ساز کشیدنی، پرداخت آنلاین، کد تخفیف و پنل مدیریت کامل — همه در یک جا، بدون یک خط کد.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`${base}/signup`} className="h-13 px-8 py-3.5 rounded-2xl bg-[#0f172a] text-white font-bold hover:bg-[#1e293b] shadow-lg shadow-[#0f172a]/20">
              ساخت فروشگاه رایگان
            </Link>
            <a href={`${base}/#pricing`} className="h-13 px-8 py-3.5 rounded-2xl bg-white border border-[#e2e8f0] font-bold hover:bg-[#f8fafc]">
              مشاهده تعرفه‌ها
            </a>
          </div>
          <div className="mt-14 mx-auto max-w-3xl rounded-2xl border border-[#e2e8f0] bg-white shadow-xl overflow-hidden text-right">
            <div className="h-9 bg-[#f1f5f9] flex items-center gap-1.5 px-4" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#fca5a5]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#fcd34d]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#86efac]" />
              <span className="mx-auto text-[11px] text-[#64748b] bg-white rounded-md px-3 py-0.5" dir="ltr">
                myshop{platformConfig().suffix}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 p-5" aria-hidden="true">
              <div className="col-span-3 h-28 rounded-xl bg-gradient-to-l from-[#ff7a59] to-[#e31b23] p-4 text-white">
                <p className="font-bold">حراج ویژه فصل</p>
                <p className="text-sm opacity-80">تا ۴۰٪ تخفیف</p>
              </div>
              {["#e0e7ff", "#dcfce7", "#fef3c7"].map((c) => (
                <div key={c} className="rounded-xl p-3 space-y-2" style={{ background: c }}>
                  <div className="h-14 rounded-lg bg-white/70" />
                  <div className="h-2 w-2/3 rounded bg-white" />
                  <div className="h-2 w-1/3 rounded bg-white" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-20">
        <h2 className="text-3xl font-extrabold text-center">هر چه برای فروش آنلاین لازم دارید</h2>
        <p className="text-center text-[#64748b] mt-3">بدون افزونه و هزینه پنهان</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-[#eef2f6] p-6 hover:shadow-lg hover:-translate-y-0.5 transition">
              <span className="h-11 w-11 rounded-xl bg-[#fff1ec] text-[#e31b23] grid place-items-center">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-[#64748b] leading-7">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-[#f8fafc] py-20 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-extrabold text-center">در سه قدم آنلاین شوید</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl bg-white border border-[#eef2f6] p-6">
                <span className="text-sm font-bold text-[#e31b23]">قدم {i + 1}</span>
                <s.icon className="h-7 w-7 mt-3" />
                <h3 className="mt-3 font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-[#64748b] leading-7">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-20">
        <h2 className="text-3xl font-extrabold text-center">تعرفه‌ها</h2>
        <p className="text-center text-[#64748b] mt-3 mb-8">همه پلن‌ها با {formatNumber(trialDays)} روز استفاده رایگان</p>
        {plans.length ? (
          <Pricing plans={plans} base={base} trialDays={trialDays} />
        ) : (
          <p className="text-center text-[#64748b]">تعرفه‌ها در حال حاضر در دسترس نیست؛ کمی بعد دوباره سر بزنید.</p>
        )}
      </section>

      <section id="faq" className="bg-[#f8fafc] py-20 scroll-mt-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-extrabold text-center mb-10">سؤالات متداول</h2>
          <div className="space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group rounded-2xl bg-white border border-[#eef2f6] p-5">
                <summary className="font-bold cursor-pointer list-none flex items-center justify-between gap-3">
                  {q}
                  <span className="text-[#94a3b8] group-open:rotate-45 transition text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-[#475569] leading-7">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl bg-[#0f172a] text-white px-8 py-14 text-center">
          <h2 className="text-3xl font-extrabold">همین امروز شروع کنید</h2>
          <p className="mt-3 text-white/70">{formatNumber(trialDays)} روز رایگان؛ هر زمان خواستید پلن را تغییر دهید.</p>
          <Link href={`${base}/signup`} className="mt-8 inline-flex h-12 px-8 items-center rounded-2xl bg-white text-[#0f172a] font-bold hover:bg-[#f1f5f9]">
            ساخت فروشگاه
          </Link>
        </div>
      </section>
    </>
  );
}
