import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Clock, FileText, Package, ShoppingBag, Users, Wallet } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import { adminApi, getAdminSession } from "@/lib/api/admin";
import type { DashboardStats } from "@/types/api";
import { formatNumber, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_FA = {
  pending: "در انتظار بررسی",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
} as const;

/** Real KPIs for the current store (last 30 days) from /admin/stats */
export default async function AdminDashboardPage() {
  const [session, stats] = await Promise.all([getAdminSession(), adminApi<DashboardStats>("/admin/stats?days=30")]);

  // Fill missing days so the chart has one bar per day
  const days: { day: string; revenue: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    days.push({ day: d, revenue: stats.byDay.find((x) => x.day === d)?.revenue ?? 0 });
  }
  const max = Math.max(...days.map((d) => d.revenue), 1);

  const cards = [
    { label: "فروش ۳۰ روز", value: formatPrice(stats.revenue), icon: Wallet, href: "/admin/orders" },
    { label: "سفارش‌ها", value: formatNumber(stats.orders), icon: ShoppingBag, href: "/admin/orders" },
    { label: "میانگین سفارش", value: formatPrice(stats.avgOrder), icon: ArrowUpRight, href: "/admin/orders" },
    { label: "مشتری‌ها", value: formatNumber(stats.customers), icon: Users, href: "/admin/customers" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AdminPageHeader
        title={`سلام، ${session?.user.name ?? ""}`}
        description={`خلاصه وضعیت «${session?.store.storeName ?? ""}» در ۳۰ روز گذشته`}
      />

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-[#E8E8E8] bg-white p-4 hover:shadow-sm transition-shadow">
            <c.icon className="h-5 w-5 text-[#737373]" />
            <p className="mt-3 text-xs text-[#737373]">{c.label}</p>
            <p className="mt-1 text-lg font-bold text-[#111] tabular-nums">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-[#E8E8E8] bg-white p-5">
          <h2 className="text-sm font-bold text-[#111] mb-4">فروش ۱۴ روز اخیر</h2>
          <div className="flex items-end gap-1.5 h-40" role="img" aria-label="نمودار فروش روزانه">
            {days.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end" title={`${d.day}: ${formatPrice(d.revenue)}`}>
                <div className="w-full rounded-t bg-[#111]/80" style={{ height: `${Math.max(2, (d.revenue / max) * 100)}%` }} />
              </div>
            ))}
          </div>
          {stats.orders === 0 && <p className="mt-3 text-xs text-[#A3A3A3]">هنوز سفارشی در این بازه ثبت نشده است.</p>}
        </section>

        <section className="rounded-2xl border border-[#E8E8E8] bg-white p-5 space-y-3">
          <h2 className="text-sm font-bold text-[#111]">کارهای امروز</h2>
          <Link href="/admin/orders" className="flex items-center gap-2 text-sm hover:underline">
            <Clock className="h-4 w-4 text-amber-600" />
            {formatNumber(stats.pending)} سفارش در انتظار بررسی رسید
          </Link>
          <Link href="/admin/products" className="flex items-center gap-2 text-sm hover:underline">
            <Package className="h-4 w-4 text-[#737373]" />
            {formatNumber(stats.products)} محصول
          </Link>
          <Link href="/admin/pages" className="flex items-center gap-2 text-sm hover:underline">
            <FileText className="h-4 w-4 text-[#737373]" />
            {formatNumber(stats.publishedPages)} صفحه منتشرشده از {formatNumber(stats.pages)}
          </Link>
          {stats.lowStock.length > 0 && (
            <div className="pt-2 border-t border-[#F0F0F0] space-y-1.5">
              <p className="text-xs font-semibold text-red-700 inline-flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> موجودی کم
              </p>
              {stats.lowStock.map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}`} className="flex justify-between text-xs hover:underline">
                  <span className="truncate">{p.name}</span>
                  <span className="tabular-nums">{formatNumber(p.stock)}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-[#E8E8E8] bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#111]">آخرین سفارش‌ها</h2>
          <Link href="/admin/orders" className="text-xs text-[#737373] hover:text-[#111]">همه</Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="text-xs text-[#A3A3A3]">سفارشی وجود ندارد.</p>
        ) : (
          <ul className="divide-y divide-[#F0F0F0]">
            {stats.recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="font-mono text-xs" dir="ltr">{o.number}</span>
                <span className="flex-1 truncate">{o.customer.fullName}</span>
                <span className="tabular-nums">{formatPrice(o.total)}</span>
                <AdminBadge tone={o.status === "pending" ? "warning" : o.status === "cancelled" ? "danger" : "success"}>
                  {STATUS_FA[o.status]}
                </AdminBadge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
