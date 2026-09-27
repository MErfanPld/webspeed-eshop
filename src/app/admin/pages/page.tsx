"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { pageRepository } from "@/builder/repositories/local-storage-repository";
import type { ManagedPage } from "@/builder/contracts/page-contract";
import {
  Plus,
  Pencil,
  Copy,
  Trash2,
  ExternalLink,
  LayoutTemplate,
} from "lucide-react";
import { cn } from "@/lib/utils";

const typeLabel: Record<ManagedPage["type"], string> = {
  home: "خانه",
  landing: "لندینگ",
  content: "محتوا",
  custom: "سفارشی",
};

export default function AdminPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<ManagedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const reload = async () => {
    setLoading(true);
    const list = await pageRepository.listPages();
    setPages(list);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDuplicate = async (id: string) => {
    const copy = await pageRepository.duplicatePage(id);
    await reload();
    router.push(`/admin/builder/${copy.id}`);
  };

  const handleDelete = async (id: string) => {
    if (id === "home") return;
    if (!confirm("حذف این صفحه؟")) return;
    try {
      await pageRepository.deletePage(id);
      await reload();
    } catch (e) {
      alert(e instanceof Error ? e.message : "خطا");
    }
  };

  const handleCreateBlank = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const id = `page-${Date.now()}`;
      const ts = new Date().toISOString();
      await pageRepository.savePage({
        schemaVersion: 1,
        id,
        name: "صفحه جدید",
        slug: `/p/${id}`,
        type: "custom",
        status: "draft",
        createdAt: ts,
        updatedAt: ts,
        blocks: [],
        description: "صفحه خالی برای طراحی از صفر",
      });
      router.push(`/admin/builder/${id}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "خطا در ساخت صفحه");
      setCreating(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl px-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold leading-tight">صفحات</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
            یک صفحه خالی بسازید یا صفحه موجود را در صفحه‌ساز ویرایش کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateBlank}
          disabled={creating}
          className="h-10 sm:h-11 px-4 rounded-xl bg-primary text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-primary-hover disabled:opacity-60 shrink-0"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>{creating ? "در حال ساخت..." : "طراحی صفحه جدید"}</span>
        </button>
      </div>

      {!loading && pages.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-white p-8 sm:p-12 text-center">
          <LayoutTemplate className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm font-semibold">هنوز صفحه‌ای ندارید</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            با یک صفحه خالی شروع کنید و بلوک‌ها را اضافه کنید.
          </p>
          <button
            type="button"
            onClick={handleCreateBlank}
            className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            شروع طراحی
          </button>
        </div>
      )}

      <div className="border border-border rounded-2xl overflow-hidden bg-white">
        <div className="md:hidden divide-y divide-border">
          {loading && (
            <p className="p-4 text-sm text-muted-foreground">در حال بارگذاری...</p>
          )}
          {!loading &&
            pages.map((p) => (
              <div key={p.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono truncate">
                      {p.slug}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0",
                      p.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {p.status === "published" ? "منتشر" : "پیش‌نویس"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {typeLabel[p.type]} · {p.blocks?.length ?? 0} بلوک
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <Link
                    href={`/admin/builder/${p.id}`}
                    className="h-9 px-3 rounded-lg bg-foreground text-background text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    ویرایش
                  </Link>
                  {p.status === "published" && p.slug && (
                    <Link
                      href={p.slug === "/" ? "/" : p.slug}
                      className="h-9 w-9 rounded-lg border border-border inline-flex items-center justify-center hover:bg-muted"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDuplicate(p.id)}
                    className="h-9 w-9 rounded-lg border border-border inline-flex items-center justify-center hover:bg-muted"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  {p.id !== "home" && (
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="h-9 w-9 rounded-lg border border-border inline-flex items-center justify-center hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#fafafa] text-[11px] font-semibold text-muted-foreground">
                <th className="text-right px-4 py-3">نام</th>
                <th className="text-right px-4 py-3">مسیر</th>
                <th className="text-right px-4 py-3">نوع</th>
                <th className="text-right px-4 py-3">وضعیت</th>
                <th className="text-right px-4 py-3">بلوک‌ها</th>
                <th className="text-left px-4 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    در حال بارگذاری...
                  </td>
                </tr>
              )}
              {!loading &&
                pages.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-[#fafafa]/50">
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">{typeLabel[p.type]}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                          p.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        )}
                      >
                        {p.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{p.blocks?.length ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/builder/${p.id}`}
                          className="h-8 px-2.5 rounded-lg bg-foreground text-background text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          ویرایش
                        </Link>
                        {p.status === "published" && p.slug && (
                          <Link
                            href={p.slug === "/" ? "/" : p.slug}
                            className="h-8 w-8 rounded-lg border border-border inline-flex items-center justify-center hover:bg-muted"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p.id)}
                          className="h-8 w-8 rounded-lg border border-border inline-flex items-center justify-center hover:bg-muted"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        {p.id !== "home" && (
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            className="h-8 w-8 rounded-lg border border-border inline-flex items-center justify-center hover:bg-red-50 text-red-600"
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
      </div>
    </div>
  );
}
