import Link from "next/link";
import { Store } from "lucide-react";

/** Shown on a store host when no store exists there or its subscription ended. */
export default function StoreUnavailable({ reason }: { reason: "not-found" | "inactive" }) {
  const domain = (process.env.PLATFORM_DOMAIN || "").trim();
  return (
    <div className="min-h-[100dvh] grid place-items-center px-4 bg-[#f8fafc]" dir="rtl" style={{ fontFamily: "Vazirmatn, Tahoma, system-ui, sans-serif" }}>
      <div className="max-w-md text-center">
        <span className="mx-auto h-14 w-14 rounded-2xl bg-white border border-[#e2e8f0] grid place-items-center">
          <Store className="h-6 w-6 text-[#64748b]" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-[#0f172a]" data-testid="store-unavailable">
          {reason === "inactive" ? "این فروشگاه موقتاً غیرفعال است" : "فروشگاهی در این آدرس وجود ندارد"}
        </h1>
        <p className="mt-3 text-[#64748b] leading-7">
          {reason === "inactive"
            ? "مدیر فروشگاه می‌تواند با ورود به پنل و تمدید اشتراک، فروشگاه را دوباره فعال کند."
            : "آدرس را بررسی کنید. اگر می‌خواهید فروشگاه خودتان را بسازید، چند دقیقه بیشتر وقت نمی‌برد."}
        </p>
        {reason === "inactive" ? (
          <Link href="/admin" className="mt-6 inline-flex h-11 px-6 items-center rounded-xl bg-[#0f172a] text-white text-sm font-bold">ورود به پنل فروشگاه</Link>
        ) : (
          domain && (
            <a href={`https://${domain}/signup`} className="mt-6 inline-flex h-11 px-6 items-center rounded-xl bg-[#0f172a] text-white text-sm font-bold">
              ساخت فروشگاه
            </a>
          )
        )}
      </div>
    </div>
  );
}
