"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Percent, Plus, Trash2 } from "lucide-react";
import type { Coupon, CouponKind } from "@/types/api";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import { api, errorMessage } from "@/lib/api/client";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { formatNumber, formatPrice } from "@/lib/utils";

type Draft = {
  id?: number;
  code: string;
  kind: CouponKind;
  value: string;
  maxDiscount: string;
  minOrder: string;
  usageLimit: string;
  perCustomerLimit: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
};

const empty: Draft = {
  code: "",
  kind: "percent",
  value: "",
  maxDiscount: "",
  minOrder: "",
  usageLimit: "",
  perCustomerLimit: "",
  startsAt: "",
  endsAt: "",
  active: true,
};

/** ISO → value for <input type="datetime-local"> (local time). */
function toLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const num = (v: string) => (v.trim() === "" ? null : Number(v));

export default function CouponsManager({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => draft && setDraft({ ...draft, [k]: v });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError(null);
    setFieldErrors({});
    try {
      const body = {
        code: draft.code,
        kind: draft.kind,
        value: num(draft.value),
        maxDiscount: num(draft.maxDiscount),
        minOrder: num(draft.minOrder) ?? 0,
        usageLimit: num(draft.usageLimit),
        perCustomerLimit: num(draft.perCustomerLimit),
        startsAt: draft.startsAt ? new Date(draft.startsAt).toISOString() : null,
        endsAt: draft.endsAt ? new Date(draft.endsAt).toISOString() : null,
        active: draft.active,
      };
      if (draft.id) await api(`/admin/coupons/${draft.id}`, { method: "PUT", body });
      else await api("/admin/coupons", { method: "POST", body });
      setDraft(null);
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "ذخیره ناموفق بود"));
      const details = (err as { details?: unknown }).details;
      if (details && typeof details === "object") setFieldErrors(details as Record<string, string>);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: Coupon) => {
    if (!(await confirmDialog({ title: `حذف کد «${c.code}»؟`, confirmLabel: "حذف", danger: true }))) return;
    try {
      await api(`/admin/coupons/${c.id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "حذف ناموفق بود"));
    }
  };

  const edit = (c: Coupon) =>
    setDraft({
      id: c.id,
      code: c.code,
      kind: c.kind,
      value: String(c.value),
      maxDiscount: c.maxDiscount ? String(c.maxDiscount) : "",
      minOrder: c.minOrder ? String(c.minOrder) : "",
      usageLimit: c.usageLimit ? String(c.usageLimit) : "",
      perCustomerLimit: c.perCustomerLimit ? String(c.perCustomerLimit) : "",
      startsAt: toLocal(c.startsAt),
      endsAt: toLocal(c.endsAt),
      active: c.active,
    });

  const field = (label: string, k: keyof Draft, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="block text-xs font-semibold text-[#525252] mb-1.5">{label}</span>
      <AdminInput
        name={k}
        value={String(draft?.[k] ?? "")}
        onChange={(e) => set(k, e.target.value as never)}
        aria-invalid={!!fieldErrors[k]}
        {...props}
      />
      {fieldErrors[k] && <span className="block text-[11px] text-red-600 mt-1">{fieldErrors[k]}</span>}
    </label>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="کدهای تخفیف"
        description="تخفیف درصدی یا مبلغ ثابت؛ مبلغ نهایی همیشه روی سرور محاسبه می‌شود."
        actions={
          <AdminButton variant="primary" onClick={() => setDraft({ ...empty })}>
            <Plus className="h-4 w-4" />
            کد جدید
          </AdminButton>
        }
      />
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      {draft && (
        <form onSubmit={save} className="bg-white border border-[#E8E8E8] rounded-2xl p-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {field("کد (انگلیسی)", "code", { dir: "ltr", required: true, className: "font-mono text-left uppercase" })}
          <label className="block">
            <span className="block text-xs font-semibold text-[#525252] mb-1.5">نوع</span>
            <select
              name="kind"
              value={draft.kind}
              onChange={(e) => set("kind", e.target.value as CouponKind)}
              className="w-full h-10 rounded-xl border border-[#E8E8E8] bg-white px-3 text-sm"
            >
              <option value="percent">درصدی</option>
              <option value="fixed">مبلغ ثابت (تومان)</option>
            </select>
          </label>
          {field(draft.kind === "percent" ? "درصد (۱ تا ۱۰۰)" : "مبلغ (تومان)", "value", { type: "number", min: 1, required: true, dir: "ltr" })}
          {draft.kind === "percent" && field("سقف تخفیف (اختیاری)", "maxDiscount", { type: "number", min: 1, dir: "ltr" })}
          {field("حداقل مبلغ سفارش", "minOrder", { type: "number", min: 0, dir: "ltr" })}
          {field("تعداد کل استفاده (خالی = نامحدود)", "usageLimit", { type: "number", min: 1, dir: "ltr" })}
          {field("استفاده برای هر مشتری", "perCustomerLimit", { type: "number", min: 1, dir: "ltr" })}
          {field("شروع", "startsAt", { type: "datetime-local", dir: "ltr" })}
          {field("پایان", "endsAt", { type: "datetime-local", dir: "ltr" })}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.active} onChange={(e) => set("active", e.target.checked)} />
            فعال
          </label>
          <div className="flex gap-2 items-end sm:col-span-2 lg:col-span-3">
            <AdminButton type="submit" variant="primary" loading={busy}>
              ذخیره
            </AdminButton>
            <AdminButton type="button" onClick={() => setDraft(null)}>
              انصراف
            </AdminButton>
          </div>
        </form>
      )}

      {!coupons.length ? (
        <AdminEmptyState icon={<Percent className="h-5 w-5" />} title="هنوز کد تخفیفی ندارید" description="اولین کد تخفیف را بسازید." />
      ) : (
        <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[#737373] text-xs">
              <tr className="border-b border-[#F0F0F0]">
                <th className="text-right p-3">کد</th>
                <th className="text-right p-3">تخفیف</th>
                <th className="text-right p-3">استفاده</th>
                <th className="text-right p-3">وضعیت</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-[#F7F7F7] last:border-0" data-testid="coupon-row">
                  <td className="p-3 font-mono font-semibold" dir="ltr">{c.code}</td>
                  <td className="p-3">
                    {c.kind === "percent" ? `${formatNumber(c.value)}٪` : formatPrice(c.value)}
                    {c.minOrder ? <span className="block text-[11px] text-[#A3A3A3]">حداقل {formatPrice(c.minOrder)}</span> : null}
                  </td>
                  <td className="p-3">
                    {formatNumber(c.usedCount)}
                    {c.usageLimit ? ` / ${formatNumber(c.usageLimit)}` : ""}
                  </td>
                  <td className="p-3">
                    {c.active ? <AdminBadge tone="success">فعال</AdminBadge> : <AdminBadge>غیرفعال</AdminBadge>}
                  </td>
                  <td className="p-3 text-left whitespace-nowrap">
                    <button type="button" aria-label="ویرایش" className="h-8 w-8 rounded-lg hover:bg-[#F7F7F7] inline-flex items-center justify-center" onClick={() => edit(c)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="حذف" className="h-8 w-8 rounded-lg hover:bg-red-50 text-red-600 inline-flex items-center justify-center" onClick={() => remove(c)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
