"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Newspaper, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminEmptyState from "@/components/admin/ui/AdminEmptyState";
import ArticleBody from "@/components/platform/ArticleBody";
import { api, ApiError, errorMessage } from "@/lib/api/client";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

export type AdminArticle = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  body: string;
  status: "draft" | "published";
  publishedAt: string | null;
};

const EMPTY: Omit<AdminArticle, "id"> = { slug: "", title: "", excerpt: "", category: "آموزش", author: "تیم وب‌اسپید", body: "", status: "draft", publishedAt: null };

function slugify(t: string) {
  return t.trim().toLowerCase().replace(/[^\w؀-ۿ]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export default function ArticlesManager({ articles }: { articles: AdminArticle[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<(Omit<AdminArticle, "id"> & { id?: number }) | null>(null);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const save = async (status?: "draft" | "published") => {
    if (!draft) return;
    setBusy(true);
    setError(null);
    setErrors({});
    const body = { ...draft, status: status ?? draft.status };
    try {
      if (draft.id) await api(`/platform/admin/articles/${draft.id}`, { method: "PUT", body });
      else await api("/platform/admin/articles", { method: "POST", body });
      setDraft(null);
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError && e.details && typeof e.details === "object") setErrors(e.details as Record<string, string>);
      setError(errorMessage(e, "ذخیره ناموفق بود"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (a: AdminArticle) => {
    if (!(await confirmDialog({ title: `حذف «${a.title}»؟`, confirmLabel: "حذف", danger: true }))) return;
    await api(`/platform/admin/articles/${a.id}`, { method: "DELETE" }).catch((e) => setError(errorMessage(e)));
    router.refresh();
  };

  if (draft) {
    const f = "block text-xs font-semibold text-[#525252] mb-1.5";
    return (
      <div className="max-w-5xl mx-auto space-y-5">
        <AdminPageHeader
          title={draft.id ? "ویرایش مقاله" : "مقاله جدید"}
          actions={<AdminButton onClick={() => setDraft(null)}><X className="h-4 w-4" /> بستن</AdminButton>}
        />
        {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
        <div className="rounded-2xl bg-white border border-[#ece8f5] p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className={f}>عنوان</span>
              <AdminInput name="title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: draft.id ? draft.slug : slugify(e.target.value) })} aria-invalid={!!errors.title} /></label>
            <label><span className={f}>آدرس (اسلاگ)</span><AdminInput name="slug" dir="ltr" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} aria-invalid={!!errors.slug} />
              {errors.slug && <span className="text-[11px] text-red-600">{errors.slug}</span>}</label>
            <label><span className={f}>دسته</span><AdminInput value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></label>
            <label className="sm:col-span-2"><span className={f}>خلاصه (در کارت و نتایج جستجو)</span>
              <AdminInput name="excerpt" value={draft.excerpt} maxLength={300} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} /></label>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(f, "mb-0 flex-1")}>متن — <span className="font-normal text-[#9a97ab]">«## » تیتر، «- » فهرست، **پررنگ**؛ پاراگراف‌ها را با یک خط خالی جدا کنید</span></span>
            <button type="button" onClick={() => setPreview((v) => !v)} className={cn("h-8 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5", preview ? "bg-[#ede9fe] text-[#6d28d9]" : "border border-[#E8E8E8]")}>
              <Eye className="h-3.5 w-3.5" /> پیش‌نمایش
            </button>
          </div>
          <div className={cn("grid gap-4", preview && "lg:grid-cols-2")}>
            <textarea name="body" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} rows={18} className="w-full rounded-xl border border-[#E8E8E8] px-3 py-2 text-sm leading-8 font-[inherit]" />
            {preview && <div className="rounded-xl border border-[#f3f0fa] bg-[#fbfaff] p-5 overflow-auto max-h-[36rem]"><ArticleBody body={draft.body || "متن مقاله..."} /></div>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AdminButton variant="primary" loading={busy} onClick={() => save("published")}><Save className="h-4 w-4" /> ذخیره و انتشار</AdminButton>
            <AdminButton loading={busy} onClick={() => save("draft")}>ذخیره پیش‌نویس</AdminButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AdminPageHeader
        title="مقالات"
        description="وبلاگ سایت معرفی؛ مقاله‌های منتشرشده در صفحه اصلی و /blog نمایش داده می‌شوند."
        actions={<AdminButton variant="primary" onClick={() => setDraft({ ...EMPTY })}><Plus className="h-4 w-4" /> مقاله جدید</AdminButton>}
      />
      {error && <p role="alert" className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      {!articles.length ? (
        <AdminEmptyState icon={<Newspaper className="h-5 w-5" />} title="هنوز مقاله‌ای ندارید" />
      ) : (
        <ul className="space-y-2.5">
          {articles.map((a) => (
            <li key={a.id} className="rounded-2xl bg-white border border-[#ece8f5] p-4 flex items-center gap-3" data-testid="article-row">
              <span className={cn("h-10 w-10 rounded-xl grid place-items-center shrink-0", a.status === "published" ? "bg-[#ecfdf5] text-emerald-700" : "bg-[#fffbeb] text-amber-700")}>
                <Newspaper className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{a.title}</p>
                <p className="text-xs text-[#9a97ab] truncate">
                  {a.status === "published" ? "منتشرشده" : "پیش‌نویس"} · {a.category} · <span dir="ltr">/blog/{a.slug}</span>
                </p>
              </div>
              {a.status === "published" && (
                <a href={`/platform/blog/${a.slug}`} target="_blank" rel="noopener" aria-label="مشاهده" className="h-9 w-9 rounded-lg hover:bg-[#f3f0fa] grid place-items-center"><Eye className="h-4 w-4" /></a>
              )}
              <button type="button" aria-label="ویرایش" onClick={() => setDraft({ ...a })} className="h-9 w-9 rounded-lg hover:bg-[#f3f0fa] grid place-items-center"><Pencil className="h-4 w-4" /></button>
              <button type="button" aria-label="حذف" onClick={() => remove(a)} className="h-9 w-9 rounded-lg hover:bg-red-50 text-red-600 grid place-items-center"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
