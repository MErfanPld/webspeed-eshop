import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import ArticleBody from "@/components/platform/ArticleBody";
import ArticleCard from "@/components/platform/ArticleCard";
import { faDate, platformConfig } from "@/lib/platform";
import { getArticle } from "@/lib/platform-data";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getArticle(decodeURIComponent((await params).slug));
  if (!data) return { title: "مقاله یافت نشد" };
  const a = data.article;
  return {
    title: a.title,
    description: a.excerpt,
    openGraph: { type: "article", title: a.title, description: a.excerpt, images: a.cover ? [{ url: a.cover }] : [] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const data = await getArticle(decodeURIComponent((await params).slug));
  if (!data) notFound();
  const { article: a, related } = data;
  const { base } = platformConfig();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    author: { "@type": "Organization", name: a.author },
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    image: a.cover || undefined,
  };

  return (
    <article className="relative isolate">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="absolute inset-x-0 top-0 h-96 -z-10 bg-gradient-to-b from-[#f5f3ff] via-[#fdf2f8] to-transparent" />
      <div className="mx-auto max-w-3xl px-4 pt-12 pb-20">
        <Link href={`${base}/blog`} className="inline-flex items-center gap-1 text-sm text-[#7c3aed] font-semibold">
          <ArrowRight className="h-4 w-4" /> همه مقالات
        </Link>
        {a.category && <p className="mt-6 text-sm font-bold text-[#db2777]">{a.category}</p>}
        <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold leading-[1.4]">{a.title}</h1>
        <p className="mt-5 text-lg text-[#475569] leading-9">{a.excerpt}</p>
        <p className="mt-5 text-sm text-[#94a3b8] flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>{a.author}</span>
          <span>{faDate(a.publishedAt)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {formatNumber(a.readMinutes)} دقیقه مطالعه</span>
        </p>
        {a.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.cover} alt="" className="mt-8 w-full rounded-3xl aspect-[16/9] object-cover shadow-xl" />
        )}
        <div className="mt-10 rounded-3xl bg-white border border-[#f1f0fb] p-6 sm:p-10 shadow-sm">
          <ArticleBody body={a.body} />
        </div>
        <div className="mt-10 rounded-3xl bg-gradient-to-l from-[#7c3aed] to-[#db2777] text-white p-8 text-center">
          <p className="text-xl font-extrabold">فروشگاه خودتان را بسازید</p>
          <Link href={`${base}/signup`} className="mt-4 inline-flex h-11 px-6 items-center gap-2 rounded-xl bg-white text-[#6d28d9] font-bold">
            شروع رایگان <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <h2 className="text-2xl font-extrabold mb-6">مقالات مرتبط</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r, i) => <ArticleCard key={r.slug} a={r} base={base} i={i + 1} />)}
          </div>
        </section>
      )}
    </article>
  );
}
