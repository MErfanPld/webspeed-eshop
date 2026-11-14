"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteMedia, uploadMedia } from "@/lib/media-client";
import { errorMessage } from "@/lib/api/client";
import type { MediaItem } from "@/types/api";
import { formatNumber } from "@/lib/utils";

type Item = MediaItem;

export default function MediaManager({ items, canDelete }: { items: Item[]; canDelete: boolean }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const f of Array.from(files)) await uploadMedia(f);
      router.refresh();
    } catch (e) {
      setError(errorMessage(e, "آپلود ناموفق بود"));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  const remove = async (m: Item) => {
    const ok = await confirmDialog({
      title: `حذف «${m.name}»؟`,
      message: "صفحات و محصولاتی که از این تصویر استفاده می‌کنند تصویر شکسته نشان می‌دهند.",
      confirmLabel: "حذف",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteMedia(m.id);
      router.refresh();
    } catch (e) {
      setError(errorMessage(e, "حذف ناموفق بود"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <AdminPageHeader
        title="کتابخانه رسانه"
        description={`${formatNumber(items.length)} فایل · PNG، JPG، WEBP، GIF تا ۵ مگابایت`}
        actions={
          <>
            <AdminButton variant="primary" loading={busy} onClick={() => input.current?.click()}>
              <Upload className="h-4 w-4" />
              آپلود تصویر
            </AdminButton>
            <input ref={input} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={(e) => upload(e.target.files)} />
          </>
        }
      />
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      {!items.length ? (
        <AdminEmptyState icon={<ImageIcon className="h-5 w-5" />} title="هنوز فایلی آپلود نشده" description="تصاویر محصولات و بنرها را اینجا آپلود کنید." />
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((m) => (
            <figure key={m.id} className="rounded-2xl border border-[#E8E8E8] bg-white overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.name} className="h-32 w-full object-cover bg-[#F7F7F7]" loading="lazy" />
              <figcaption className="p-2.5 space-y-1.5">
                <p className="text-xs font-medium truncate" title={m.name}>{m.name}</p>
                <p className="text-[10px] text-[#A3A3A3]">{formatNumber(Math.round(m.size / 1024))} KB</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="flex-1 h-7 rounded-lg border border-[#E8E8E8] text-[11px] inline-flex items-center justify-center gap-1"
                    onClick={async () => {
                      await navigator.clipboard.writeText(m.url).catch(() => null);
                      setCopied(m.id);
                      setTimeout(() => setCopied(null), 1500);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                    {copied === m.id ? "کپی شد" : "کپی آدرس"}
                  </button>
                  {canDelete && (
                    <button type="button" aria-label="حذف" className="h-7 w-7 rounded-lg border border-[#E8E8E8] text-red-600 inline-flex items-center justify-center" onClick={() => remove(m)}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
