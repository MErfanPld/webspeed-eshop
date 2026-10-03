"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { pageRepository } from "@/builder/repositories/local-storage-repository";
import type { ManagedPage } from "@/builder/contracts/page-contract";
import {
  normalizeSlug,
  isValidSlug,
  isReservedSlug,
  slugFromName,
} from "@/lib/page-slug";
import {
  Plus,
  Pencil,
  Copy,
  Trash2,
  ExternalLink,
  LayoutTemplate,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const typeLabel: Record<ManagedPage["type"], string> = {
  home: "خانه",
  landing: "لندینگ",
  content: "محتوا",
  custom: "سفارشی",
};

const SYSTEM_IDS = new Set([
  "home",
  "product",
  "category",
  "search",
  "cart",
  "checkout",
  "404",
]);

export default function AdminPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<ManagedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    setPages(await pageRepository.listPages());
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const normalizedSlug = useMemo(
    () => normalizeSlug(slug || slugFromName(name)),
    [slug, name]
  );

  const slugError = useMemo(() => {
    if (!name.trim() && !slug.trim()) return null;
    if (!isValidSlug(normalizedSlug))
      return "آدرس نامعتبر است. فقط حروف، عدد، - و /";
    if (isReservedSlug(normalizedSlug) && normalizedSlug !== "/")
      return "این مسیر سیستمی است و قابل استفاده نیست";
    const clash = pages.find((p) => p.slug === normalizedSlug);
    if (clash) return `این آدرس قبلاً برای «${clash.name}» استفاده شده`;
    return null;
  }, [normalizedSlug, pages, name, slug]);

  const openCreate = () => {
    setName("");
    setSlug("");
    setSlugTouched(false);
    setFormError(null);
    setModalOpen(true);
  };

  const handleCreate = async () => {
    if (creating) return;
    if (!name.trim()) {
      setFormError("نام صفحه الزامی است");
      return;
    }
    if (slugError) {
      setFormError(slugError);
      return;
    }
    setCreating(true);
    setFormError(null);
    try {
      const id = `page-${Date.now()}`;
      const ts = new Date().toISOString();
      const finalSlug = normalizeSlug(slug || slugFromName(name));
      await pageRepository.savePage({
        schemaVersion: 1,
        id,
        name: name.trim(),
        slug: finalSlug,
        type: "custom",
        status: "draft",
        createdAt: ts,
        updatedAt: ts,
        blocks: [],
        description: "",
      });
      setModalOpen(false);
      router.push(`/admin/builder/${id}`);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "خطا در ساخت صفحه");
      setCreating(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    const copy = await pageRepository.duplicatePage(id);
    await reload();
    router.push(`/admin/builder/${copy.id}`);
  };

  const handleDelete = async (id: string) => {
    if (SYSTEM_IDS.has(id) || id === "home") {
      alert("صفحات سیستمی قابل حذف نیستند");
      return;
    }
    if (!confirm("حذف این صفحه؟")) return;
    try {
      await pageRepository.deletePage(id);
      await reload();
    } catch (e) {
      alert(e instanceof Error ? e.message : "خطا");
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl px-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-[#111]">صفحات</h1>
          <p className="text-xs sm:text-sm text-[#737373] mt-1">
            صفحات سیستمی و سفارشی — برای صفحه جدید نام و URL تعیین کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="h-10 px-4 rounded-xl bg-[#111] text-white text-sm font-semibold inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          صفحه جدید
        </button>
      </div>

      <div className="border border-[#E8E8E8] rounded-2xl overflow-hidden bg-white">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E8E8] bg-[#FAFAFA] text-[11px] font-semibold text-[#737373]">
                <th className="text-right px-4 py-3">نام</th>
                <th className="text-right px-4 py-3">آدرس</th>
                <th className="text-right px-4 py-3">نوع</th>
                <th className="text-right px-4 py-3">وضعیت</th>
                <th className="text-right px-4 py-3">بلوک‌ها</th>
                <th className="text-left px-4 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#737373]">
                    در حال بارگذاری...
                  </td>
                </tr>
              )}
              {!loading &&
                pages.map((p) => (
                  <tr key={p.id} className="border-b border-[#E8E8E8] last:border-0 hover:bg-[#FAFAFA]/80">
                    <td className="px-4 py-3 font-semibold text-[#111]">
                      {p.name}
                      {SYSTEM_IDS.has(p.id) && (
                        <span className="mr-2 text-[10px] text-[#A3A3A3]">سیستمی</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#737373]">{p.slug}</td>
                    <td className="px-4 py-3 text-[#737373]">{typeLabel[p.type]}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                          p.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        )}
                      >
                        {p.status === "published" ? "منتشر" : "پیش‌نویس"}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{p.blocks?.length ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/builder/${p.id}`}
                          className="h-8 px-2.5 rounded-lg bg-[#111] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          ویرایش
                        </Link>
                        {p.status === "published" && p.slug && (
                          <Link
                            href={p.slug === "/" ? "/" : p.slug}
                            className="h-8 w-8 rounded-lg border border-[#E8E8E8] inline-flex items-center justify-center"
                            title="مشاهده"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p.id)}
                          className="h-8 w-8 rounded-lg border border-[#E8E8E8] inline-flex items-center justify-center"
                          title="تکرار"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        {!SYSTEM_IDS.has(p.id) && p.id !== "home" && (
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="h-8 w-8 rounded-lg border border-[#E8E8E8] inline-flex items-center justify-center text-red-600"
                            title="حذف"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-[#E8E8E8]">
          {loading && <p className="p-4 text-sm text-[#737373]">در حال بارگذاری...</p>}
          {!loading &&
            pages.map((p) => (
              <div key={p.id} className="p-4 space-y-2">
                <p className="text-sm font-bold text-[#111]">{p.name}</p>
                <p className="text-[11px] font-mono text-[#A3A3A3]">{p.slug}</p>
                <div className="flex gap-1.5 pt-1">
                  <Link
                    href={`/admin/builder/${p.id}`}
                    className="h-9 px-3 rounded-lg bg-[#111] text-white text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    ویرایش
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(p.id)}
                    className="h-9 w-9 rounded-lg border border-[#E8E8E8] inline-flex items-center justify-center"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !creating && setModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#E8E8E8] shadow-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-[#111]">صفحه جدید</p>
                <p className="text-[11px] text-[#737373] mt-0.5">نام و آدرس URL را مشخص کنید</p>
              </div>
              <button type="button" className="h-8 w-8 rounded-lg hover:bg-[#F7F7F7] inline-flex items-center justify-center" onClick={() => setModalOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold text-[#737373]">نام صفحه</span>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(slugFromName(e.target.value));
                }}
                placeholder="مثلاً درباره ما"
                className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm"
                autoFocus
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold text-[#737373]">آدرس (Slug)</span>
              <input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                placeholder="about-us"
                className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm font-mono dir-ltr text-left"
              />
              <p className="text-[11px] text-[#A3A3A3] font-mono dir-ltr text-left">
                Preview: {normalizedSlug}
              </p>
              {slugError && <p className="text-[11px] text-red-600">{slugError}</p>}
            </label>
            {formError && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{formError}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" disabled={creating} onClick={() => setModalOpen(false)} className="h-10 px-4 rounded-xl border border-[#E8E8E8] text-sm font-semibold">
                انصراف
              </button>
              <button
                type="button"
                disabled={creating || !!slugError || !name.trim()}
                onClick={handleCreate}
                className="h-10 px-4 rounded-xl bg-[#111] text-white text-sm font-semibold disabled:opacity-50"
              >
                {creating ? "..." : "ساخت و ورود به صفحه‌ساز"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && pages.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#E8E8E8] bg-white p-10 text-center">
          <LayoutTemplate className="h-10 w-10 mx-auto text-[#A3A3A3] mb-3" />
          <p className="text-sm font-semibold">هنوز صفحه‌ای ندارید</p>
          <button type="button" onClick={openCreate} className="mt-4 h-10 px-4 rounded-xl bg-[#111] text-white text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            ساخت صفحه
          </button>
        </div>
      )}
    </div>
  );
}
