"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, MessageSquare, Star, Trash2, X } from "lucide-react";
import type { AdminReview, ReviewStatus } from "@/types/api";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import { api, errorMessage } from "@/lib/api/client";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "pending", label: "در انتظار" },
  { key: "approved", label: "تأییدشده" },
  { key: "rejected", label: "ردشده" },
  { key: "all", label: "همه" },
];

const TONE = { pending: "warning", approved: "success", rejected: "danger" } as const;
const LABEL = { pending: "در انتظار", approved: "تأییدشده", rejected: "ردشده" };

export default function ReviewsModeration({ reviews, status }: { reviews: AdminReview[]; status: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const moderate = async (r: AdminReview, next: ReviewStatus) => {
    setBusy(r.id);
    setError(null);
    try {
      await api(`/admin/reviews/${r.id}`, { method: "PATCH", body: { status: next } });
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "تغییر وضعیت ناموفق بود"));
    } finally {
      setBusy(null);
    }
  };

  const remove = async (r: AdminReview) => {
    if (!(await confirmDialog({ title: "حذف این نظر؟", confirmLabel: "حذف", danger: true }))) return;
    try {
      await api(`/admin/reviews/${r.id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "حذف ناموفق بود"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AdminPageHeader title="نظرات مشتریان" description="فقط خریداران هر محصول می‌توانند نظر بدهند؛ نظرها پس از تأیید نمایش داده می‌شوند." />
      <nav className="flex gap-2 flex-wrap" aria-label="فیلتر وضعیت">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/reviews?status=${t.key}`}
            aria-current={status === t.key ? "page" : undefined}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm border",
              status === t.key ? "bg-[#111] text-white border-[#111]" : "bg-white border-[#E8E8E8] text-[#525252] hover:bg-[#F7F7F7]"
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      {!reviews.length ? (
        <AdminEmptyState icon={<MessageSquare className="h-5 w-5" />} title="نظری در این بخش نیست" />
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="bg-white border border-[#E8E8E8] rounded-2xl p-4" data-testid="review-row">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{r.user}</span>
                    <span className="inline-flex" aria-label={`${r.rating} از ۵`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-amber-400 text-amber-400" : "text-[#D4D4D4]")} />
                      ))}
                    </span>
                    <AdminBadge tone={TONE[r.status]}>{LABEL[r.status]}</AdminBadge>
                  </div>
                  <p className="text-xs text-[#737373] mt-1">برای «{r.productName}»</p>
                  <p className="text-sm text-[#262626] mt-2 leading-7 whitespace-pre-line">{r.comment}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {r.status !== "approved" && (
                    <button type="button" disabled={busy === r.id} onClick={() => moderate(r, "approved")} aria-label="تأیید" className="h-8 w-8 rounded-lg hover:bg-emerald-50 text-emerald-700 inline-flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button type="button" disabled={busy === r.id} onClick={() => moderate(r, "rejected")} aria-label="رد" className="h-8 w-8 rounded-lg hover:bg-amber-50 text-amber-700 inline-flex items-center justify-center">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button type="button" onClick={() => remove(r)} aria-label="حذف" className="h-8 w-8 rounded-lg hover:bg-red-50 text-red-600 inline-flex items-center justify-center">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
