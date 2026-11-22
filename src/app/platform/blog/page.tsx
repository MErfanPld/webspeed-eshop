import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/platform/ArticleCard";
import { platformConfig } from "@/lib/platform";
import { getArticles } from "@/lib/platform-data";
import { cn, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "مقالات",
  description: "آموزش راه‌اندازی و رشد فروشگاه اینترنتی: عکاسی محصول، تخفیف، بازاریابی و مدیریت سفارش.",
};
export const dynamic = "force-dynamic";

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const sp = await searchParams;
  const { base } = platformConfig();
  const page = Math.max(1, Number(sp.page) || 1);
  const data = await getArticles(page, sp.category);
  const link = (q: Record<string, string | undefined>) => {
    const u = new URLSearchParams(Object.entries(q).filter(([, v]) => v) as [string, string][]);
    return `${base}/blog${u.size ? `?${u}` : ""}`;
  };

  return (
    <div className="relative isolate">
      <div className="absolute inset-x-0 top-0 h-72 -z-10 bg-gradient-to-b from-[#f5f3ff] to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-bold text-[#7c3aed]">وبلاگ وب‌اسپید</p>
        <h1 className="mt-2 text-4xl font-extrabold">مقالات و آموزش‌ها</h1>
        <p className="mt-3 text-[#64748b]">راهنمای عملی برای راه‌اندازی و رشد فروش آنلاین</p>

        {data && data.categories.length > 1 && (
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="دسته‌بندی مقالات">
            {[undefined, ...data.categories].map((c) => (
              <Link
                key={c ?? "all"}
                href={link({ category: c })}
                aria-current={sp.category === c ? "page" : undefined}
                className={cn(
                  "h-9 px-4 rounded-full text-sm inline-flex items-center border transition",
                  sp.category === c ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-white border-[#ede9fe] hover:border-[#c4b5fd]"
                )}
              >
                {c ?? "همه"}
              </Link>
            ))}
          </nav>
        )}

        {!data || !data.articles.length ? (
          <p className="mt-16 text-center text-[#64748b]">هنوز مقاله‌ای منتشر نشده است.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.articles.map((a, i) => <ArticleCard key={a.slug} a={a} base={base} i={i} />)}
          </div>
        )}

        {data && data.pagination.pages > 1 && (
          <nav className="mt-12 flex justify-center gap-2" aria-label="صفحه‌بندی">
            {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={link({ category: sp.category, page: p > 1 ? String(p) : undefined })}
                aria-current={p === page ? "page" : undefined}
                className={cn("h-10 w-10 rounded-xl grid place-items-center text-sm border", p === page ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "bg-white border-[#ede9fe]")}
              >
                {formatNumber(p)}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
