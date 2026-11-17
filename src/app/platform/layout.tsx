import type { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";
import { platformConfig } from "@/lib/platform";

export const metadata: Metadata = {
  title: { default: "وب‌اسپید | فروشگاه‌ساز اینترنتی", template: "%s | وب‌اسپید" },
  description:
    "در چند دقیقه فروشگاه اینترنتی خودتان را روی آدرس اختصاصی بسازید: صفحه‌ساز کشیدنی، پرداخت آنلاین، کد تخفیف، پیامک سفارش و پنل مدیریت کامل.",
  openGraph: { siteName: "وب‌اسپید", locale: "fa_IR", type: "website" },
};

/** Marketing site of the platform (webspeed.ir) — independent from any store */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { panelUrl, base } = platformConfig();
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0f172a]" style={{ fontFamily: "Vazirmatn, Tahoma, system-ui, sans-serif" }} dir="rtl">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-[#eef2f6]">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-6">
          <Link href={`${base}/`} className="flex items-center gap-2 font-extrabold text-lg">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#e31b23] to-[#ff7a59] text-white grid place-items-center">
              <Zap className="h-5 w-5" />
            </span>
            وب‌اسپید
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm text-[#475569]" aria-label="بخش‌های سایت">
            <a href={`${base}/#features`} className="hover:text-[#0f172a]">امکانات</a>
            <a href={`${base}/#how`} className="hover:text-[#0f172a]">نحوه کار</a>
            <a href={`${base}/#pricing`} className="hover:text-[#0f172a]">تعرفه‌ها</a>
            <a href={`${base}/#faq`} className="hover:text-[#0f172a]">سؤالات</a>
          </nav>
          <div className="flex-1" />
          <a href={panelUrl} className="text-sm font-medium text-[#475569] hover:text-[#0f172a]">ورود</a>
          <Link href={`${base}/signup`} className="h-10 px-4 rounded-xl bg-[#0f172a] text-white text-sm font-semibold inline-flex items-center hover:bg-[#1e293b]">
            شروع رایگان
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[#eef2f6] bg-[#f8fafc]">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm text-[#64748b]">
          <div>
            <p className="font-extrabold text-[#0f172a] mb-2">وب‌اسپید</p>
            <p className="leading-7">فروشگاه‌ساز ایرانی برای فروش آنلاین؛ سریع، امن و بدون نیاز به برنامه‌نویسی.</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-[#0f172a]">لینک‌ها</p>
            <a href={`${base}/#pricing`} className="block hover:text-[#0f172a]">تعرفه‌ها</a>
            <Link href={`${base}/signup`} className="block hover:text-[#0f172a]">ساخت فروشگاه</Link>
            <a href={panelUrl} className="block hover:text-[#0f172a]">ورود به پنل</a>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-[#0f172a]">پشتیبانی</p>
            <p>شنبه تا پنجشنبه، ۹ تا ۱۸</p>
          </div>
        </div>
        <p className="text-center text-xs text-[#94a3b8] pb-6">© {new Date().getFullYear()} وب‌اسپید</p>
      </footer>
    </div>
  );
}
