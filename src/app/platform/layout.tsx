import type { Metadata } from "next";
import Link from "next/link";
import { Headphones, Instagram, Mail, Phone, Send, ShieldCheck, Zap } from "lucide-react";
import PlatformHeader from "@/components/platform/PlatformHeader";
import { platformConfig } from "@/lib/platform";
import { getLanding } from "@/lib/platform-data";

export const metadata: Metadata = {
  title: { default: "وب‌اسپید | فروشگاه‌ساز اینترنتی", template: "%s | وب‌اسپید" },
  description:
    "در چند دقیقه فروشگاه اینترنتی خودتان را روی آدرس اختصاصی بسازید: صفحه‌ساز کشیدنی، پرداخت آنلاین، کد تخفیف، پیامک سفارش و پنل مدیریت کامل.",
  openGraph: { siteName: "وب‌اسپید", locale: "fa_IR", type: "website" },
};

/** Marketing site of the platform (webspeed.ir) — content from /django-admin */
export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { panelUrl, base } = platformConfig();
  const s = (await getLanding())?.settings;
  const hasVideo = Boolean(s && (s.videoUrl || s.videoFile));
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaff] text-[#0f172a]" style={{ fontFamily: "Vazirmatn, Tahoma, system-ui, sans-serif" }} dir="rtl">
      <PlatformHeader base={base} panelUrl={panelUrl} hasVideo={hasVideo} />
      <main className="flex-1">{children}</main>
      <footer className="relative overflow-hidden bg-[#0b1020] text-white/70">
        <div className="absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-[#7c3aed]/30 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="lg:col-span-2">
            <p className="flex items-center gap-2 font-extrabold text-white text-lg">
              <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#7c3aed] via-[#db2777] to-[#ff9f43] grid place-items-center"><Zap className="h-5 w-5 fill-current" /></span>
              وب‌اسپید
            </p>
            <p className="mt-4 leading-7 max-w-sm">فروشگاه‌ساز ایرانی برای فروش آنلاین؛ سریع، امن و بدون نیاز به برنامه‌نویسی.</p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-emerald-300"><ShieldCheck className="h-4 w-4" /> ارتباط رمزنگاری‌شده و داده جداگانه برای هر فروشگاه</p>
          </div>
          <div className="space-y-2.5">
            <p className="font-bold text-white">دسترسی سریع</p>
            <a href={`${base}/#pricing`} className="block hover:text-white">تعرفه‌ها</a>
            <Link href={`${base}/blog`} className="block hover:text-white">مقالات</Link>
            <Link href={`${base}/signup`} className="block hover:text-white">ساخت فروشگاه</Link>
            <a href={panelUrl} className="block hover:text-white">ورود به پنل</a>
          </div>
          <div className="space-y-2.5">
            <p className="font-bold text-white">پشتیبانی</p>
            {s?.supportHours && <p className="flex items-center gap-2"><Headphones className="h-4 w-4" /> {s.supportHours}</p>}
            {s?.supportPhone && <a href={`tel:${s.supportPhone}`} className="flex items-center gap-2 hover:text-white" dir="ltr"><Phone className="h-4 w-4" /> {s.supportPhone}</a>}
            {s?.supportEmail && <a href={`mailto:${s.supportEmail}`} className="flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4" /> {s.supportEmail}</a>}
            <div className="flex gap-2 pt-1">
              {s?.instagram && <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener" aria-label="اینستاگرام" className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center hover:bg-white/20"><Instagram className="h-4 w-4" /></a>}
              {s?.telegram && <a href={`https://t.me/${s.telegram}`} target="_blank" rel="noopener" aria-label="تلگرام" className="h-9 w-9 rounded-xl bg-white/10 grid place-items-center hover:bg-white/20"><Send className="h-4 w-4" /></a>}
            </div>
            {/* eNamad trust badge: HTML entered by the platform admin in django-admin */}
            {s?.enamadHtml && <div className="pt-2 [&_img]:h-20 [&_img]:w-auto bg-white rounded-xl inline-block p-1" dangerouslySetInnerHTML={{ __html: s.enamadHtml }} />}
          </div>
        </div>
        <p className="relative text-center text-xs text-white/40 pb-6">© {new Intl.NumberFormat("fa-IR", { useGrouping: false }).format(new Date().getFullYear())} وب‌اسپید — همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
}
