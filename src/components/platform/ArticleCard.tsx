import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { faDate, type ArticleSummary } from "@/lib/platform";
import { formatNumber } from "@/lib/utils";

const COVERS = ["from-[#ff6b6b] to-[#ff9f43]", "from-[#7c3aed] to-[#c084fc]", "from-[#0ea5e9] to-[#22d3ee]", "from-[#10b981] to-[#84cc16]"];

export default function ArticleCard({ a, base, i = 0 }: { a: ArticleSummary; base: string; i?: number }) {
  return (
    <Link href={`${base}/blog/${a.slug}`} className="group rounded-3xl bg-white border border-[#eef2f6] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition flex flex-col" data-testid="article-card">
      <div className={`aspect-[16/9] relative bg-gradient-to-br ${COVERS[i % COVERS.length]}`}>
        {a.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.cover} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        ) : (
          <span className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <span className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/15" />
            <span className="absolute top-6 left-10 h-16 w-16 rounded-2xl bg-white/15 rotate-12" />
            <BookOpen className="absolute bottom-5 right-5 h-12 w-12 text-white/90" />
          </span>
        )}
        {a.category && <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 text-[#0f172a]">{a.category}</span>}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg leading-8 group-hover:text-[#7c3aed] transition">{a.title}</h3>
        <p className="mt-2 text-sm text-[#64748b] leading-7 line-clamp-2 flex-1">{a.excerpt}</p>
        <p className="mt-4 text-xs text-[#94a3b8] flex items-center gap-3">
          <span>{faDate(a.publishedAt)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {formatNumber(a.readMinutes)} دقیقه</span>
        </p>
      </div>
    </Link>
  );
}
