"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Receipt, Search, ShoppingBag, X } from "lucide-react";
import type { Order, OrderStatus } from "@/types/api";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import { api, errorMessage } from "@/lib/api/client";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { cn, formatNumber, formatPrice } from "@/lib/utils";

export const STATUS_FA: Record<OrderStatus, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تأیید شده",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

const TONE: Record<OrderStatus, "neutral" | "success" | "warning" | "danger" | "info"> = {
  pending: "warning",
  confirmed: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
};

/** Loads a short-lived signed URL for the private receipt from the API */
function ReceiptImage({ orderId }: { orderId: string }) {
  const [state, setState] = useState<{ url?: string; error?: string }>({});
  useEffect(() => {
    let cancelled = false;
    setState({});
    api<{ url: string }>(`/admin/orders/${orderId}/receipt`)
      .then((r) => !cancelled && setState({ url: r.url }))
      .catch((e) => !cancelled && setState({ error: errorMessage(e, "دریافت رسید ناموفق بود") }));
    return () => {
      cancelled = true;
    };
  }, [orderId]);
  if (state.error) return <p className="text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>;
  if (!state.url) return <p className="text-xs text-[#A3A3A3]">در حال بارگذاری رسید...</p>;
  return (
    <a href={state.url} target="_blank" rel="noreferrer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={state.url} alt="رسید پرداخت" className="w-full max-h-96 object-contain rounded-xl border border-[#E8E8E8] bg-[#FAFAFA]" />
    </a>
  );
}

function date(iso: string) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export default function OrdersManager({ orders, canEdit }: { orders: Order[]; canEdit: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim();
    return orders.filter(
      (o) =>
        (status === "all" || o.status === status) &&
        (!s || o.number.includes(s.toUpperCase()) || o.customer.fullName.includes(s) || o.customer.phone.includes(s))
    );
  }, [orders, status, q]);

  const open = orders.find((o) => o.id === openId) || null;

  const changeStatus = async (o: Order, next: OrderStatus) => {
    if (next === o.status) return;
    if (next === "cancelled") {
      const ok = await confirmDialog({
        title: `لغو سفارش ${o.number}؟`,
        message: "موجودی اقلام سفارش به انبار برمی‌گردد.",
        confirmLabel: "لغو سفارش",
        danger: true,
      });
      if (!ok) return;
    }
    setBusy(true);
    setError(null);
    try {
      await api(`/admin/orders/${o.id}`, { method: "PATCH", body: { status: next } });
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "تغییر وضعیت ناموفق بود"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AdminPageHeader title="سفارش‌ها" description={`${formatNumber(orders.length)} سفارش`} />
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative sm:max-w-xs flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A3A3A3]" />
          <AdminInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="شماره، نام یا موبایل..." className="pr-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "pending", "confirmed", "shipped", "delivered", "cancelled"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "h-9 px-3 rounded-lg text-xs font-semibold border",
                status === s ? "bg-[#111] text-white border-[#111]" : "bg-white border-[#E8E8E8] text-[#525252]"
              )}
            >
              {s === "all" ? "همه" : STATUS_FA[s]}
            </button>
          ))}
        </div>
      </div>

      {!filtered.length ? (
        <AdminEmptyState
          icon={<ShoppingBag className="h-5 w-5" />}
          title={orders.length ? "سفارشی با این فیلتر نیست" : "هنوز سفارشی ثبت نشده"}
          description={orders.length ? "فیلتر را تغییر دهید." : "سفارش‌های فروشگاه اینجا نمایش داده می‌شوند."}
        />
      ) : (
        <div className="rounded-2xl border border-[#E8E8E8] bg-white overflow-x-auto">
          <table className="w-full text-sm text-right min-w-[720px]">
            <thead>
              <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA] text-[11px] text-[#737373]">
                <th className="font-semibold px-5 py-3">سفارش</th>
                <th className="font-semibold px-3 py-3">مشتری</th>
                <th className="font-semibold px-3 py-3">تاریخ</th>
                <th className="font-semibold px-3 py-3">مبلغ</th>
                <th className="font-semibold px-5 py-3">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-[#F5F5F5] last:border-0 hover:bg-[#FAFAFA] cursor-pointer" onClick={() => setOpenId(o.id)}>
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold" dir="ltr">{o.number}</td>
                  <td className="px-3 py-3.5">
                    <p className="font-medium text-[#111]">{o.customer.fullName}</p>
                    <p className="text-[11px] text-[#A3A3A3]" dir="ltr">{o.customer.phone}</p>
                  </td>
                  <td className="px-3 py-3.5 text-[#525252] text-xs">{date(o.createdAt)}</td>
                  <td className="px-3 py-3.5 tabular-nums font-medium">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3.5">
                    <AdminBadge tone={TONE[o.status]}>{STATUS_FA[o.status]}</AdminBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex justify-start" role="dialog" aria-modal="true" aria-label={`سفارش ${open.number}`}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpenId(null)} />
          <aside className="relative h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#737373]">سفارش</p>
                <p className="font-bold font-mono" dir="ltr">{open.number}</p>
              </div>
              <button type="button" aria-label="بستن" onClick={() => setOpenId(null)} className="h-9 w-9 rounded-lg hover:bg-[#F7F7F7] inline-flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>

            <section className="space-y-2">
              <p className="text-xs font-bold text-[#737373]">وضعیت</p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(STATUS_FA) as OrderStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={!canEdit || busy}
                    onClick={() => changeStatus(open, s)}
                    className={cn(
                      "h-8 px-3 rounded-lg text-xs font-semibold border disabled:opacity-50",
                      open.status === s ? "bg-[#111] text-white border-[#111]" : "bg-white border-[#E8E8E8]"
                    )}
                  >
                    {STATUS_FA[s]}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#E8E8E8] p-4 text-sm space-y-1">
              <p className="font-semibold">{open.customer.fullName}</p>
              <p dir="ltr" className="text-right text-[#525252]">{open.customer.phone}{open.customer.email ? ` · ${open.customer.email}` : ""}</p>
              <p className="text-[#525252]">
                {open.customer.province}، {open.customer.city}، {open.customer.address}
              </p>
              <p className="text-[#737373] text-xs">کد پستی: {open.customer.postalCode}</p>
            </section>

            <section className="space-y-2">
              {open.items.map((it, i) => (
                <div key={i} className="flex justify-between gap-3 text-sm">
                  <span>
                    {it.name} <span className="text-[#A3A3A3] text-xs">({it.size} · {it.color})</span> × {formatNumber(it.quantity)}
                  </span>
                  <span className="tabular-nums shrink-0">{formatPrice(it.lineTotal)}</span>
                </div>
              ))}
              <div className="border-t border-[#F0F0F0] pt-2 text-sm space-y-1">
                <div className="flex justify-between text-[#737373]"><span>ارسال</span><span>{open.shipping ? formatPrice(open.shipping) : "رایگان"}</span></div>
                <div className="flex justify-between font-bold"><span>جمع کل</span><span>{formatPrice(open.total)}</span></div>
              </div>
            </section>

            {open.hasReceipt && (
              <section className="space-y-2">
                <p className="text-xs font-bold text-[#737373] inline-flex items-center gap-1"><Receipt className="h-3.5 w-3.5" /> رسید پرداخت</p>
                <ReceiptImage orderId={open.id} />
              </section>
            )}
            <AdminButton type="button" onClick={() => setOpenId(null)} className="w-full">بستن</AdminButton>
          </aside>
        </div>
      )}
    </div>
  );
}
