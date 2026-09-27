import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-[#111111] text-white text-[11px] sm:text-xs">
      <div className="mx-auto max-w-content px-3 sm:px-4 lg:px-6 h-9 flex items-center justify-between gap-3">
        <p className="truncate">
          ارسال رایگان برای سفارش‌های بالای{" "}
          <span className="font-semibold num">۲٬۵۰۰٬۰۰۰</span> تومان
        </p>
        <Link
          href="/products"
          className="shrink-0 underline underline-offset-2 hover:text-white/80"
        >
          مشاهده فروشگاه
        </Link>
      </div>
    </div>
  );
}
