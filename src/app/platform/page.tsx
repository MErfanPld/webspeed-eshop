import Link from "next/link";
import { ArrowLeft, CheckCircle2, Headphones, Lock, PlayCircle, ShieldCheck, Star, Zap } from "lucide-react";
import Pricing from "@/components/platform/Pricing";
import VideoSection from "@/components/platform/VideoSection";
import StatsCounter from "@/components/platform/StatsCounter";
import ArticleCard from "@/components/platform/ArticleCard";
import PlatformIcon, { CHIP_COLORS } from "@/components/platform/PlatformIcon";
import { platformConfig, videoEmbedUrl } from "@/lib/platform";
import { getLanding } from "@/lib/platform-data";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PlatformHome() {
  const { base, suffix } = platformConfig();
  const data = await getLanding();

  if (!data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="text-2xl font-extrabold">وب‌اسپید</h1>
        <p className="mt-3 text-[#64748b]">سایت در حال به‌روزرسانی است؛ چند دقیقه دیگر دوباره سر بزنید.</p>
      </div>
    );
  }
  const { settings: s, stats, features, roadmap, faq, testimonials, articles, plans, trialDays } = data;
  const hasVideo = Boolean(s.videoFile || videoEmbedUrl(s.videoUrl) || s.videoUrl);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden -mt-16 pt-16">
        <div className="absolute inset-0 -z-10 bg-[#fbfaff]" />
        <div className="absolute -top-32 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-[#c084fc]/35 blur-[110px] -z-10" />
        <div className="absolute top-20 left-[-10%] h-[30rem] w-[30rem] rounded-full bg-[#ff9f43]/30 blur-[110px] -z-10" />
        <div className="absolute top-72 left-1/3 h-[22rem] w-[22rem] rounded-full bg-[#22d3ee]/25 blur-[100px] -z-10" />
        <div className="mx-auto max-w-6xl px-4 pt-16 sm:pt-24 pb-16 text-center">
          {s.heroBadge && (
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-[#ede9fe] text-[#6d28d9] shadow-sm">
              <Zap className="h-3.5 w-3.5 fill-current" /> {s.heroBadge}
            </span>
          )}
          <h1 className="mt-7 text-[2.4rem] leading-[1.35] sm:text-6xl sm:leading-[1.3] font-extrabold tracking-tight">
            {s.heroTitle}{" "}
            <span className="bg-gradient-to-l from-[#7c3aed] via-[#db2777] to-[#ff9f43] bg-clip-text text-transparent">{s.heroHighlight}</span>{" "}
            {s.heroTitleEnd}
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-9">{s.heroSubtitle}</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`${base}/signup`}
              className="h-14 px-8 rounded-2xl bg-gradient-to-l from-[#7c3aed] to-[#db2777] text-white font-bold inline-flex items-center justify-center gap-2 shadow-xl shadow-[#7c3aed]/30 hover:shadow-2xl hover:-translate-y-0.5 transition"
            >
              {s.ctaPrimary} <ArrowLeft className="h-4 w-4" />
            </Link>
            <a
              href={hasVideo ? `${base}/#video` : `${base}/#pricing`}
              className="h-14 px-8 rounded-2xl bg-white/80 backdrop-blur border border-[#e9e5ff] font-bold inline-flex items-center justify-center gap-2 hover:bg-white transition"
            >
              <PlayCircle className="h-5 w-5 text-[#7c3aed]" /> {hasVideo ? s.ctaSecondary : "مشاهده تعرفه‌ها"}
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#475569]">
            {[`${formatNumber(trialDays)} روز رایگان`, "بدون نیاز به برنامه‌نویسی", "پشتیبانی فارسی"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t}</li>
            ))}
          </ul>

          {/* Product preview */}
          <div className="mt-14 mx-auto max-w-4xl rounded-[1.75rem] bg-white/70 backdrop-blur-xl p-2 ring-1 ring-[#ede9fe] shadow-[0_40px_100px_-30px_rgba(124,58,237,0.45)]" aria-hidden="true">
            <div className="rounded-[1.4rem] bg-white overflow-hidden border border-[#f1f5f9] text-right">
              <div className="h-10 bg-[#f8fafc] flex items-center gap-1.5 px-4 border-b border-[#f1f5f9]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#fca5a5]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#fcd34d]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#86efac]" />
                <span className="mx-auto text-[11px] text-[#64748b] bg-white rounded-md px-3 py-0.5 border border-[#f1f5f9] inline-flex items-center gap-1" dir="ltr">
                  <Lock className="h-3 w-3 text-emerald-500" /> myshop{suffix}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3 p-4 sm:p-5">
                <div className="col-span-4 sm:col-span-3 h-32 sm:h-40 rounded-2xl bg-gradient-to-l from-[#7c3aed] via-[#db2777] to-[#ff9f43] p-5 text-white flex flex-col justify-end">
                  <p className="font-extrabold text-lg">حراج ویژه فصل</p>
                  <p className="text-sm opacity-85">تا ۴۰٪ تخفیف روی کالکشن جدید</p>
                </div>
                <div className="hidden sm:flex flex-col gap-3">
                  <div className="flex-1 rounded-2xl bg-[#ecfeff] p-3"><p className="text-[11px] text-[#0e7490] font-bold">فروش امروز</p><p className="font-extrabold text-[#0e7490]">+۱۲٪</p></div>
                  <div className="flex-1 rounded-2xl bg-[#fef3c7] p-3"><p className="text-[11px] text-[#92400e] font-bold">سفارش جدید</p><p className="font-extrabold text-[#92400e]">۸</p></div>
                </div>
                {["#ede9fe", "#fce7f3", "#dcfce7", "#e0f2fe"].map((c) => (
                  <div key={c} className="rounded-2xl p-2.5 space-y-2" style={{ background: c }}>
                    <div className="h-16 sm:h-20 rounded-xl bg-white/80" />
                    <div className="h-2 w-3/4 rounded bg-white" />
                    <div className="h-2 w-1/3 rounded bg-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {stats && (
            <div className="mt-12 mx-auto max-w-3xl">
              <StatsCounter stats={stats} />
            </div>
          )}
        </div>
      </section>

      {/* ---------- Trust bar ---------- */}
      <section className="border-y border-[#f1f0fb] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {[
            [ShieldCheck, "داده جدا برای هر فروشگاه", "text-emerald-600 bg-emerald-50"],
            [Lock, "ارتباط امن (SSL)", "text-sky-600 bg-sky-50"],
            [Zap, "سرعت بالا و بهینه برای موبایل", "text-amber-600 bg-amber-50"],
            [Headphones, s.supportHours ? `پشتیبانی ${s.supportHours}` : "پشتیبانی فارسی", "text-violet-600 bg-violet-50"],
          ].map(([Icon, label, cls]) => {
            const I = Icon as typeof Lock;
            return (
              <div key={label as string} className="flex items-center gap-3">
                <span className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${cls}`}><I className="h-5 w-5" /></span>
                <span className="font-medium text-[#334155]">{label as string}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Features ---------- */}
      {features.length > 0 && (
        <section id="features" className="mx-auto max-w-6xl px-4 py-24 scroll-mt-20">
          <p className="text-center text-sm font-bold text-[#db2777]">امکانات</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-center">هر چه برای فروش آنلاین لازم دارید</h2>
          <p className="text-center text-[#64748b] mt-3">بدون افزونه و هزینه پنهان</p>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={f.title} className="group rounded-3xl bg-white border border-[#f1f0fb] p-6 hover:shadow-xl hover:shadow-[#7c3aed]/5 hover:-translate-y-1 transition">
                <span className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${CHIP_COLORS[i % CHIP_COLORS.length]} grid place-items-center shadow-lg group-hover:scale-110 transition`}>
                  <PlatformIcon name={f.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-bold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-[#64748b] leading-7">{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Roadmap (نقشه ساخت سایت) ---------- */}
      {roadmap.length > 0 && (
        <section id="roadmap" className="relative py-24 scroll-mt-20 bg-gradient-to-b from-[#f5f3ff] to-[#fdf2f8]">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-center text-sm font-bold text-[#7c3aed]">نقشه ساخت سایت</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-center">از ثبت‌نام تا اولین فروش</h2>
            <p className="text-center text-[#64748b] mt-3">مسیر راه‌اندازی فروشگاه شما، قدم به قدم</p>
            <ol className="mt-16 relative grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="roadmap">
              {roadmap.map((r, i) => (
                <li key={r.title} className="relative rounded-3xl bg-white/90 backdrop-blur border border-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${CHIP_COLORS[i % CHIP_COLORS.length]} grid place-items-center shrink-0`}>
                      <PlatformIcon name={r.icon} className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#94a3b8]">قدم {formatNumber(i + 1)} · {r.when}</p>
                      <h3 className="font-bold text-lg">{r.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[#64748b] leading-7">{r.text}</p>
                  {i < roadmap.length - 1 && (
                    <span className="hidden lg:block absolute top-1/2 -left-5 h-0.5 w-4 bg-gradient-to-l from-[#c084fc] to-transparent" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ---------- Video ---------- */}
      <VideoSection title={s.videoTitle} text={s.videoText} url={s.videoUrl} file={s.videoFile} poster={s.videoPoster} />

      {/* ---------- Pricing ---------- */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 scroll-mt-20">
        <p className="text-center text-sm font-bold text-[#db2777]">تعرفه‌ها</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-center">پلن مناسب کسب‌وکارتان</h2>
        <p className="text-center text-[#64748b] mt-3 mb-10">همه پلن‌ها با {formatNumber(trialDays)} روز استفاده رایگان؛ هر زمان قابل تغییر</p>
        {plans.length ? (
          <Pricing plans={plans} base={base} trialDays={trialDays} />
        ) : (
          <p className="text-center text-[#64748b]">تعرفه‌ها به‌زودی اعلام می‌شود.</p>
        )}
      </section>

      {/* ---------- Testimonials (only real ones, from django-admin) ---------- */}
      {testimonials.length > 0 && (
        <section className="bg-white py-24 border-y border-[#f1f0fb]">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center">مشتری‌ها چه می‌گویند</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.name + t.text.slice(0, 10)} className="rounded-3xl bg-[#fbfaff] border border-[#f1f0fb] p-6 flex flex-col">
                  <div className="flex gap-0.5" aria-label={`${t.rating} از ۵`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-[#e2e8f0]"}`} />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-[#334155] leading-8 flex-1">«{t.text}»</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    {t.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                    ) : (
                      <span className="h-11 w-11 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#db2777] text-white grid place-items-center font-bold">{t.name.slice(0, 1)}</span>
                    )}
                    <span>
                      <span className="block font-bold text-sm">{t.name}</span>
                      {t.role && (t.storeUrl ? <a href={t.storeUrl} target="_blank" rel="noopener" className="text-xs text-[#7c3aed] hover:underline">{t.role}</a> : <span className="text-xs text-[#64748b]">{t.role}</span>)}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Articles ---------- */}
      {articles.length > 0 && (
        <section id="articles" className="mx-auto max-w-6xl px-4 py-24 scroll-mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#0ea5e9]">مقالات</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold">آموزش فروش آنلاین</h2>
            </div>
            <Link href={`${base}/blog`} className="text-sm font-bold text-[#7c3aed] inline-flex items-center gap-1 hover:gap-2 transition-all">
              همه مقالات <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {articles.map((a, i) => <ArticleCard key={a.slug} a={a} base={base} i={i} />)}
          </div>
        </section>
      )}

      {/* ---------- FAQ ---------- */}
      {faq.length > 0 && (
        <section id="faq" className="bg-gradient-to-b from-[#fdf2f8] to-[#f5f3ff] py-24 scroll-mt-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">سؤالات متداول</h2>
            <div className="space-y-3">
              {faq.map(({ q, a }) => (
                <details key={q} className="group rounded-2xl bg-white/90 border border-white shadow-sm p-5 open:shadow-md">
                  <summary className="font-bold cursor-pointer list-none flex items-center justify-between gap-3">
                    {q}
                    <span className="h-8 w-8 rounded-full bg-[#f5f3ff] text-[#7c3aed] grid place-items-center group-open:rotate-45 transition text-xl leading-none shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-[#475569] leading-8">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-[#7c3aed] via-[#db2777] to-[#ff9f43] text-white px-8 py-16 text-center shadow-2xl shadow-[#db2777]/30">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-3xl sm:text-4xl font-extrabold">همین امروز فروش آنلاین را شروع کنید</h2>
          <p className="relative mt-4 text-white/85">{formatNumber(trialDays)} روز رایگان؛ بدون کارت بانکی و بدون قرارداد.</p>
          <Link href={`${base}/signup`} className="relative mt-9 inline-flex h-14 px-10 items-center gap-2 rounded-2xl bg-white text-[#6d28d9] font-extrabold hover:-translate-y-0.5 transition shadow-xl">
            ساخت فروشگاه <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
