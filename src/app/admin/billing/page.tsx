import { Check, CreditCard, ExternalLink } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import { adminApi } from "@/lib/api/admin";
import type { PlanInfo, SubscriptionInfo } from "@/types/api";
import { cn, formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS = {
  trial: { label: "دوره آزمایشی", tone: "info" },
  active: { label: "فعال", tone: "success" },
  suspended: { label: "معلق", tone: "danger" },
} as const;

export default async function BillingPage() {
  const { subscription: sub, plans, url } = await adminApi<{
    subscription: SubscriptionInfo | null;
    plans: PlanInfo[];
    url: string | null;
  }>("/admin/subscription");
  const date = (iso: string | null) => (iso ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date(iso)) : "—");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader title="اشتراک و پلن" description="پلن فعلی فروشگاه، زمان باقی‌مانده و مقایسه پلن‌ها" />

      {!sub ? (
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 text-sm text-[#525252]">
          این فروشگاه اشتراکی ندارد و بدون محدودیت فعال است (فروشگاه‌های ساخته‌شده پیش از راه‌اندازی پلن‌ها).
        </div>
      ) : (
        <section
          className={cn("rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4", sub.active ? "bg-white border-[#E8E8E8]" : "bg-red-50 border-red-200")}
          data-testid="current-subscription"
        >
          <span className="h-12 w-12 rounded-xl bg-[#F7F7F7] grid place-items-center shrink-0">
            <CreditCard className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm text-[#737373]">پلن فعلی</p>
            <p className="text-xl font-bold flex items-center gap-2">
              {sub.plan.name}
              <AdminBadge tone={sub.active ? STATUS[sub.status].tone : "danger"}>
                {sub.active ? STATUS[sub.status].label : "منقضی‌شده"}
              </AdminBadge>
            </p>
            <p className="text-sm text-[#525252] mt-1">
              {sub.status === "trial" ? "پایان دوره آزمایشی" : "اعتبار تا"}: {date(sub.endsAt)}
              {sub.daysLeft !== null && sub.active && <> · {formatNumber(sub.daysLeft)} روز مانده</>}
            </p>
            {!sub.active && (
              <p className="text-sm text-red-700 mt-2">فروشگاه برای بازدیدکنندگان بسته است؛ برای فعال‌سازی، اشتراک را تمدید کنید.</p>
            )}
          </div>
          {url && (
            <a href={url} target="_blank" rel="noopener" className="text-sm inline-flex items-center gap-1.5 text-[#525252] hover:text-[#111]" dir="ltr">
              {url.replace(/^https?:\/\//, "")} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => {
          const current = sub?.plan.slug === p.slug;
          return (
            <div key={p.slug} className={cn("bg-white rounded-2xl border p-5 flex flex-col", current ? "border-[#111] ring-2 ring-[#111]/10" : "border-[#E8E8E8]")}>
              <p className="font-bold flex items-center gap-2">
                {p.name} {current && <AdminBadge tone="info">پلن شما</AdminBadge>}
              </p>
              <p className="text-2xl font-extrabold mt-2 tabular-nums">
                {formatNumber(p.priceMonthly)} <span className="text-xs font-normal text-[#737373]">تومان / ماه</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#404040] flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[#737373] bg-[#F7F7F7] rounded-xl px-4 py-3 leading-6">
        پرداخت آنلاین اشتراک هنوز فعال نشده است. برای تمدید یا تغییر پلن با پشتیبانی تماس بگیرید؛ پس از پرداخت،
        پلن از پنل مدیریت پلتفرم فعال می‌شود.
      </p>
    </div>
  );
}
