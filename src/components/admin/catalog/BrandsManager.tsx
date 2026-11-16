"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDot, Pencil, Plus, Trash2 } from "lucide-react";
import type { Brand } from "@/types/api";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import MediaPickerButton from "@/builder/components/MediaPickerButton";
import { api, errorMessage } from "@/lib/api/client";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { formatNumber } from "@/lib/utils";

type Draft = { id?: number; name: string; slug: string; logo: string };

export default function BrandsManager({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError(null);
    try {
      const body = { name: draft.name, slug: draft.slug, logo: draft.logo };
      if (draft.id) await api(`/admin/brands/${draft.id}`, { method: "PUT", body });
      else await api("/admin/brands", { method: "POST", body });
      setDraft(null);
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "ذخیره ناموفق بود"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (b: Brand) => {
    const ok = await confirmDialog({
      title: `حذف برند «${b.name}»؟`,
      message: b.products ? `${formatNumber(b.products)} محصول بدون برند می‌مانند.` : undefined,
      confirmLabel: "حذف",
      danger: true,
    });
    if (!ok) return;
    try {
      await api(`/admin/brands/${b.id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "حذف ناموفق بود"));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="برندها"
        description={`${formatNumber(brands.length)} برند — در فرم محصول نام برند را بنویسید تا خودکار وصل شود.`}
        actions={
          <AdminButton variant="primary" onClick={() => setDraft({ name: "", slug: "", logo: "" })}>
            <Plus className="h-4 w-4" />
            برند جدید
          </AdminButton>
        }
      />
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      {draft && (
        <form onSubmit={save} className="bg-white border border-[#E8E8E8] rounded-2xl p-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] items-end">
          <label className="block">
            <span className="block text-xs font-semibold text-[#525252] mb-1.5">نام برند</span>
            <AdminInput name="brandName" value={draft.name} required onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-[#525252] mb-1.5">اسلاگ (انگلیسی)</span>
            <AdminInput name="brandSlug" value={draft.slug} dir="ltr" required className="font-mono text-left" onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          </label>
          <div className="flex gap-2 items-center">
            <MediaPickerButton onPick={(url) => setDraft({ ...draft, logo: url })} />
            {draft.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.logo} alt="" className="h-9 w-9 rounded-lg object-contain border border-[#E8E8E8]" />
            )}
            <AdminButton type="submit" variant="primary" loading={busy}>
              ذخیره
            </AdminButton>
            <AdminButton type="button" onClick={() => setDraft(null)}>
              انصراف
            </AdminButton>
          </div>
        </form>
      )}

      {!brands.length ? (
        <AdminEmptyState icon={<CircleDot className="h-5 w-5" />} title="هنوز برندی ندارید" description="اولین برند را بسازید." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <div key={b.id} className="bg-white border border-[#E8E8E8] rounded-2xl p-4 flex items-center gap-3" data-testid="brand-card">
              <div className="h-12 w-12 rounded-xl bg-[#F7F7F7] overflow-hidden shrink-0 grid place-items-center text-sm font-bold text-[#737373]">
                {b.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.logo} alt="" className="h-full w-full object-contain" />
                ) : (
                  b.name.slice(0, 1)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-[#111] truncate">{b.name}</p>
                <p className="text-[11px] text-[#A3A3A3] font-mono">{b.slug}</p>
                <p className="text-[11px] text-[#737373]">{formatNumber(b.products ?? 0)} محصول</p>
              </div>
              <button type="button" aria-label="ویرایش" className="h-8 w-8 rounded-lg hover:bg-[#F7F7F7] inline-flex items-center justify-center" onClick={() => setDraft({ id: b.id, name: b.name, slug: b.slug, logo: b.logo })}>
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" aria-label="حذف" className="h-8 w-8 rounded-lg hover:bg-red-50 text-red-600 inline-flex items-center justify-center" onClick={() => remove(b)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
