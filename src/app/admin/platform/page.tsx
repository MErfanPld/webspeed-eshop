import Link from "next/link";
import { AlertTriangle, ArrowLeft, BadgeDollarSign, Clock, Globe, Newspaper, ShoppingBag, Sparkles, Store, TrendingUp } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import { adminApi } from "@/lib/api/admin";
import { requirePlatformAdmin } from "@/lib/api/platform-admin";
import type { PlatformOverview } from "@/types/api";
import { formatNumber, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Platform owner dashboard: real numbers across every store */
export default async function PlatformDashboard() {
  await requirePlatformAdmin();
  const d = await adminApi<PlatformOverview>("/platform/overview");
  const days = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(Date.now() - (29 - i) * 864e5).toISOString().slice(0, 10);
    return { day, n: d.signups.find((x) => x.day === day)?.n ?? 0 };
  });
  const max = Math.max(1, ...days.map((x) => x.n));
  const planTotal = Math.max(1, d.byPlan.reduce((a, p) => a + p.n, 0));
  const kpis = [
    { label: "درآمد ماهانه اشتراک‌ها", value: formatPrice(d.mrr), hint: `${formatNumber(d.stores.paid)} اشتراک پرداخت‌شده`, icon: BadgeDollarSign, color: "from-[#7c3aed] to-[#c084fc]" },
    { label: "کل فروشگاه‌ها", value: formatNumber(d.stores.total), hint: `${formatNumber(d.stores.new30)} فروشگاه جدید در ۳۰ روز`, icon: Store, color: "from-[#0ea5e9] to-[#22d3ee]" },
    { label: "فروش فروشگاه‌ها (۳۰ روز)", value: formatPrice(d.orders.gmv30), hint: `${formatNumber(d.orders.count30)} سفارش`, icon: ShoppingBag, color: "from-[#db2777] to-[#f472b6]" },
    { label: "در دوره آزمایشی", value: formatNumber(d.stores.trial), hint: `${formatNumber(d.stores.expired)} منقضی/معلق`, icon: Clock, color: "from-[#f59e0b] to-[#facc15]" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AdminPageHeader title="داشبورد پلتفرم" description="وضعیت همه فروشگاه‌ها، اشتراک‌ها و درآمد — داده واقعی از دیتابیس" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="relative overflow-hidden rounded-2xl bg-white border border-[#ece8f5] p-5 shadow-sm">
            <span className={`absolute -top-6 -left-6 h-20 w-20 rounded-full bg-gradient-to-br ${k.color} opacity-15`} />
            <span className={`h-10 w-10 rounded-xl bg-gradient-to-br ${k.color} text-white grid place-items-center shadow-md`}>
              <k.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-xs text-[#6b6880]">{k.label}</p>
            <p className="mt-1 text-xl font-extrabold tabular-nums">{k.value}</p>
            <p className="mt-1 text-[11px] text-[#9a97ab]">{k.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl bg-white border border-[#ece8f5] p-5">
          <h2 className="font-bold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#7c3aed]" /> ثبت‌نام فروشگاه‌ها — ۳۰ روز اخیر</h2>
          <div className="mt-6 h-40 flex items-end gap-1" role="img" aria-label="نمودار ثبت‌نام روزانه">
            {days.map((x) => (
              <div key={x.day} className="flex-1 group relative">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#7c3aed] to-[#db2777] opacity-80 group-hover:opacity-100 transition"
                  style={{ height: `${Math.max(3, (x.n / max) * 150)}px` }}
                />
                <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1e1b2e] px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100">
                  {new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric" }).format(new Date(x.day))}: {formatNumber(x.n)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white border border-[#ece8f5] p-5">
          <h2 className="font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#db2777]" /> توزیع پلن‌ها</h2>
          <ul className="mt-5 space-y-4">
            {d.byPlan.map((p, i) => (
              <li key={p.slug}>
                <div className="flex justify-between text-sm"><span>{p.name}</span><span className="tabular-nums font-semibold">{formatNumber(p.n)}</span></div>
                <div className="mt-1.5 h-2 rounded-full bg-[#f3f0fa] overflow-hidden">
                  <div className={["bg-[#7c3aed]", "bg-[#db2777]", "bg-[#0ea5e9]", "bg-[#f59e0b]"][i % 4] + " h-full rounded-full"} style={{ width: `${(p.n / planTotal) * 100}%` }} />
                </div>
              </li>
            ))}
            {d.stores.noPlan > 0 && <li className="text-xs text-[#9a97ab]">{formatNumber(d.stores.noPlan)} فروشگاه بدون اشتراک (قدیمی/بدون محدودیت)</li>}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-white border border-[#ece8f5] p-5">
          <h2 className="font-bold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-[#f59e0b]" /> اشتراک‌های رو به پایان (۷ روز)</h2>
          {!d.expiringSoon.length ? (
            <p className="mt-4 text-sm text-[#9a97ab]">اشتراکی در هفته آینده تمام نمی‌شود.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#f3f0fa]">
              {d.expiringSoon.map((x) => (
                <li key={x.id} className="py-2.5 flex items-center justify-between text-sm">
                  <span>{x.name} <span className="text-[11px] text-[#9a97ab] font-mono" dir="ltr">{x.slug}</span></span>
                  <span className="text-xs text-[#b45309]">{x.endsAt ? new Intl.DateTimeFormat("fa-IR").format(new Date(x.endsAt)) : ""}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl bg-white border border-[#ece8f5] p-5">
          <h2 className="font-bold flex items-center gap-2"><Globe className="h-4 w-4 text-[#0ea5e9]" /> پرفروش‌ترین فروشگاه‌ها (۳۰ روز)</h2>
          {!d.topStores.length ? (
            <p className="mt-4 text-sm text-[#9a97ab]">هنوز سفارشی ثبت نشده.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#f3f0fa]">
              {d.topStores.map((t, i) => (
                <li key={t.id} className="py-2.5 flex items-center gap-3 text-sm">
                  <span className="h-7 w-7 rounded-lg bg-[#f3f0fa] grid place-items-center text-xs font-bold text-[#7c3aed]">{formatNumber(i + 1)}</span>
                  <span className="flex-1">{t.name}</span>
                  <span className="text-xs text-[#6b6880]">{formatNumber(t.orders)} سفارش</span>
                  <span className="font-semibold tabular-nums">{formatPrice(t.gmv)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { href: "/admin/platform/stores", label: "مدیریت فروشگاه‌ها و اشتراک‌ها", icon: Globe },
          { href: "/admin/platform/content", label: "ویرایش سایت معرفی", icon: Sparkles },
          { href: "/admin/platform/articles", label: `مقالات (${formatNumber(d.content.articles)} منتشرشده، ${formatNumber(d.content.drafts)} پیش‌نویس)`, icon: Newspaper },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="group rounded-2xl bg-white border border-[#ece8f5] p-4 flex items-center gap-3 hover:border-[#c4b5fd] hover:shadow-md transition">
            <l.icon className="h-5 w-5 text-[#7c3aed]" />
            <span className="flex-1 text-sm font-medium">{l.label}</span>
            <ArrowLeft className="h-4 w-4 text-[#9a97ab] group-hover:-translate-x-1 transition" />
          </Link>
        ))}
      </div>
    </div>
  );
}
