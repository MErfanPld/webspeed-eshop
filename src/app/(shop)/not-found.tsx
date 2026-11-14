import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-5xl font-bold text-foreground/20">۴۰۴</p>
      <p className="text-lg font-bold">صفحه یافت نشد</p>
      <p className="text-sm text-muted-foreground">صفحه‌ای که دنبال آن هستید وجود ندارد یا منتشر نشده است.</p>
      <Link href="/" className="text-sm font-semibold underline underline-offset-4">
        بازگشت به خانه
      </Link>
    </div>
  );
}
