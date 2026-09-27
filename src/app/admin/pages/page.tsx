"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pageRepository } from "@/builder/repositories/local-storage-repository";
import type { ManagedPage } from "@/builder/contracts/page-contract";
import { Plus, Pencil, Copy, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const typeLabel: Record<ManagedPage["type"], string> = {
  home: "خانه",
  landing: "لندینگ",
  content: "محتوا",
  custom: "سفارشی",
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<ManagedPage[]>([]);
  const [loading, setLoading] = useState(true);

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
    await pageRepository.duplicatePage(id);
    await reload();
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

  const handleCreate = async () => {
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
      description: "",
    });
    await reload();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">صفحات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            مدیریت و ویرایش صفحات فروشگاه با صفحه‌ساز
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          صفحه جدید
        </button>
      </div>

      <div className="border border-border rounded-2xl overflow-hidden bg-white">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-border bg-[#fafafa] text-[11px] font-semibold text-muted-foreground">
          <div className="col-span-4">نام صفحه</div>
          <div className="col-span-2">نوع</div>
          <div className="col-span-2">وضعیت</div>
          <div className="col-span-2">آخرین بروزرسانی</div>
          <div className="col-span-2 text-left">عملیات</div>
        </div>

        {loading ? (
          <p className="p-8 text-sm text-muted-foreground text-center">در حال بارگذاری...</p>
        ) : !pages.length ? (
          <p className="p-8 text-sm text-muted-foreground text-center">صفحه‌ای وجود ندارد</p>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="grid grid-cols-12 gap-2 px-4 py-3.5 border-b border-border last:border-0 items-center text-sm hover:bg-[#fafafa]"
            >
              <div className="col-span-4 min-w-0">
                <p className="font-semibold truncate">{page.name}</p>
                <p className="text-[11px] text-muted-foreground truncate font-mono">{page.slug}</p>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">{typeLabel[page.type]}</div>
              <div className="col-span-2">
                <span
                  className={cn(
                    "inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md",
                    page.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  )}
                >
                  {page.status === "published" ? "منتشر شده" : "پیش‌نویس"}
                </span>
              </div>
              <div className="col-span-2 text-[11px] text-muted-foreground num">
                {new Date(page.updatedAt).toLocaleDateString("fa-IR")}
              </div>
              <div className="col-span-2 flex items-center justify-end gap-0.5">
                <Link
                  href={`/admin/builder/${page.id}`}
                  className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted"
                  title="ویرایش"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                {page.slug === "/" && (
                  <Link
                    href="/"
                    target="_blank"
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted"
                    title="مشاهده"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => handleDuplicate(page.id)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted"
                  title="کپی"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {page.id !== "home" && (
                  <button
                    type="button"
                    onClick={() => handleDelete(page.id)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-600"
                    title="حذف"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
