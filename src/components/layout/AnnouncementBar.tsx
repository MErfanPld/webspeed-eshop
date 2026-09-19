import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto max-w-content px-4 py-2.5 text-center">
        <p className="text-[11px] sm:text-xs tracking-wide">
          ارسال رایگان برای سفارش‌های بالای{" "}
          <span className="num font-medium" data-num>
            ۲٬۵۰۰٬۰۰۰
          </span>{" "}
          تومان
          <span className="mx-2 opacity-40">|</span>
          <Link href="/products" className="underline underline-offset-2 hover:opacity-80">
            مشاهده فروشگاه
          </Link>
        </p>
      </div>
    </div>
  );
}
