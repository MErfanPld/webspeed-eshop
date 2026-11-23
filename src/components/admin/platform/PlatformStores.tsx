"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Globe, Search } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import type { PlanInfo, PlatformStoreRow } from "@/types/api";
import { api, errorMessage } from "@/lib/api/client";
import { formatNumber } from "@/lib/utils";

type Props = { stores: PlatformStoreRow[]; stats: { stores: number; active: number; inactive: number }; plans: PlanInfo[] };

/** Central panel: every store on the platform with its plan and status (superusers). */
export default function PlatformStores({ stores, stats, plans }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? stores.filter((r) => r.name.toLowerCase().includes(s) || r.slug.includes(s) || (r.domain ?? "").includes(s)) : stores;
  }, [q, stores]);

  const update = async (row: PlatformStoreRow, patch: Record<string, string | null>) => {
    setBusy(row.id);
    setError(null);
    try {
      await api(`/platform/stores/${row.id}`, { method: "PATCH", body: { plan: row.subscription?.plan.slug ?? plans[0]?.slug, ...patch } });
      router.refresh();
    } catch (e) {
      setError(errorMessage(e, "ذخیره ناموفق بود"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AdminPageHeader title="فروشگاه‌ها و اشتراک" description="همه فروشگاه‌ها، پلن، وضعیت اشتراک و میزان استفاده" />
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["کل فروشگاه‌ها", stats.stores],
          ["فعال", stats.active],
          ["غیرفعال / منقضی", stats.inactive],
        ].map(([label, n]) => (
          <div key={label as string} className="bg-white border border-[#E8E8E8] rounded-2xl p-4">
            <p className="text-xs text-[#737373]">{label}</p>
            <p className="text-2xl font-bold tabular-nums mt-1">{formatNumber(n as number)}</p>
          </div>
        ))}
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
        <AdminInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="نام، زیردامنه یا دامنه..." className="pr-9" aria-label="جستجوی فروشگاه" />
      </div>
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      {!filtered.length ? (
        <AdminEmptyState icon={<Globe className="h-5 w-5" />} title="فروشگاهی یافت نشد" />
      ) : (
        <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="text-[#737373] text-xs">
              <tr className="border-b border-[#F0F0F0]">
                <th className="text-right p-3">فروشگاه</th>
                <th className="text-right p-3">پلن</th>
                <th className="text-right p-3">وضعیت</th>
                <th className="text-right p-3">اعتبار تا</th>
                <th className="text-right p-3">محصول / سفارش</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const sub = r.subscription;
                return (
                  <tr key={r.id} className="border-b border-[#F7F7F7] last:border-0 align-top" data-testid="platform-store-row">
                    <td className="p-3">
                      <p className="font-semibold">{r.name}</p>
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener" className="text-[11px] text-[#737373] hover:underline inline-flex items-center gap-1" dir="ltr">
                          {r.url.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <p className="text-[11px] text-[#A3A3A3] font-mono" dir="ltr">{r.slug}</p>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        aria-label={`پلن ${r.name}`}
                        value={sub?.plan.slug ?? ""}
                        disabled={busy === r.id}
                        onChange={(e) => update(r, { plan: e.target.value })}
                        className="h-9 rounded-lg border border-[#E8E8E8] bg-white px-2 text-xs"
                      >
                        {!sub && <option value="">بدون اشتراک</option>}
                        {plans.map((p) => (
                          <option key={p.slug} value={p.slug}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 space-y-1.5">
                      {sub ? (
                        <>
                          <AdminBadge tone={sub.active ? (sub.status === "trial" ? "info" : "success") : "danger"}>
                            {!sub.active ? "منقضی / معلق" : sub.status === "trial" ? "آزمایشی" : "فعال"}
                          </AdminBadge>
                          <select
                            aria-label={`وضعیت ${r.name}`}
                            value={sub.status}
                            disabled={busy === r.id}
                            onChange={(e) => update(r, { status: e.target.value })}
                            className="block h-8 rounded-lg border border-[#E8E8E8] bg-white px-2 text-xs"
                          >
                            <option value="trial">آزمایشی</option>
                            <option value="active">فعال (پرداخت‌شده)</option>
                            <option value="suspended">معلق</option>
                          </select>
                        </>
                      ) : (
                        <AdminBadge>بدون محدودیت</AdminBadge>
                      )}
                    </td>
                    <td className="p-3">
                      <input
                        type="date"
                        aria-label={`اعتبار ${r.name}`}
                        defaultValue={sub?.paidUntil?.slice(0, 10) ?? ""}
                        disabled={busy === r.id}
                        onBlur={(e) => e.target.value !== (sub?.paidUntil?.slice(0, 10) ?? "") && update(r, { paidUntil: e.target.value || null, status: "active" })}
                        className="h-9 rounded-lg border border-[#E8E8E8] bg-white px-2 text-xs"
                        dir="ltr"
                      />
                      {sub?.status === "trial" && sub.trialEndsAt && (
                        <p className="text-[11px] text-[#737373] mt-1">
                          آزمایشی تا {new Intl.DateTimeFormat("fa-IR").format(new Date(sub.trialEndsAt))}
                        </p>
                      )}
                    </td>
                    <td className="p-3 tabular-nums text-[#525252]">
                      {formatNumber(r.products)} / {formatNumber(r.orders)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-[#737373] leading-6">
        برای فعال کردن اشتراک پرداخت‌شده، تاریخ «اعتبار تا» را تعیین کنید (وضعیت خودکار «فعال» می‌شود). فروشگاه‌های معلق یا منقضی
        برای بازدیدکنندگان بسته‌اند ولی پنل‌شان باز است. دسترسی این صفحه فقط برای کاربران superuser است
        (<code dir="ltr">python manage.py createsuperuser</code> یا تیک superuser در django-admin).
      </p>
    </div>
  );
}
