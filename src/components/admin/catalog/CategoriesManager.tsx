"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import type { Category } from "@/types/product";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import MediaPickerButton from "@/builder/components/MediaPickerButton";
import { adminFetch } from "@/context/AdminSessionContext";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { formatNumber } from "@/lib/utils";

type Draft = { id?: string; name: string; slug: string; image: string };

export default function CategoriesManager({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
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
      const body = JSON.stringify({ name: draft.name, slug: draft.slug, image: draft.image });
      if (draft.id) await adminFetch(`/api/admin/categories/${draft.id}`, { method: "PUT", body });
      else await adminFetch("/api/admin/categories", { method: "POST", body });
      setDraft(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره ناموفق بود");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: Category) => {
    const used = counts[c.slug] ?? 0;
    const ok = await confirmDialog({
      title: `حذف دسته «${c.name}»؟`,
      message: used ? `${formatNumber(used)} محصول در این دسته هستند و بدون دسته می‌مانند.` : undefined,
      confirmLabel: "حذف",
      danger: true,
    });
    if (!ok) return;
    try {
      await adminFetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف ناموفق بود");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="دسته‌بندی‌ها"
        description={`${formatNumber(categories.length)} دسته`}
        actions={
          <AdminButton variant="primary" onClick={() => setDraft({ name: "", slug: "", image: "" })}>
            <Plus className="h-4 w-4" />
            دسته جدید
          </AdminButton>
        }
      />
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      {draft && (
        <form onSubmit={save} className="bg-white border border-[#E8E8E8] rounded-2xl p-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] items-end">
          <label className="block">
            <span className="block text-xs font-semibold text-[#525252] mb-1.5">نام</span>
            <AdminInput value={draft.name} required onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-[#525252] mb-1.5">اسلاگ</span>
            <AdminInput value={draft.slug} dir="ltr" required className="font-mono text-left" onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          </label>
          <div className="flex gap-2 items-center">
            <MediaPickerButton onPick={(url) => setDraft({ ...draft, image: url })} />
            {draft.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.image} alt="" className="h-9 w-9 rounded-lg object-cover border border-[#E8E8E8]" />
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

      {!categories.length ? (
        <AdminEmptyState icon={<Tags className="h-5 w-5" />} title="هنوز دسته‌ای ندارید" description="اولین دسته را بسازید." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="bg-white border border-[#E8E8E8] rounded-2xl p-4 flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-[#F7F7F7] overflow-hidden shrink-0">
                {c.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-[#111] truncate">{c.name}</p>
                <p className="text-[11px] text-[#A3A3A3] font-mono">{c.slug}</p>
                <p className="text-[11px] text-[#737373]">{formatNumber(counts[c.slug] ?? 0)} محصول</p>
              </div>
              <button type="button" aria-label="ویرایش" className="h-8 w-8 rounded-lg hover:bg-[#F7F7F7] inline-flex items-center justify-center" onClick={() => setDraft({ id: c.id, name: c.name, slug: c.slug, image: c.image ?? "" })}>
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" aria-label="حذف" className="h-8 w-8 rounded-lg hover:bg-red-50 text-red-600 inline-flex items-center justify-center" onClick={() => remove(c)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
