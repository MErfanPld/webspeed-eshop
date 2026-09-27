"use client";

import Link from "next/link";
import {
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Save,
  Upload,
} from "lucide-react";
import { useBuilderStore } from "@/builder/store/builder-store";
import { cn } from "@/lib/utils";

export default function BuilderToolbar() {
  const page = useBuilderStore((s) => s.page);
  const previewDevice = useBuilderStore((s) => s.previewDevice);
  const setPreviewDevice = useBuilderStore((s) => s.setPreviewDevice);
  const isPreview = useBuilderStore((s) => s.isPreview);
  const setIsPreview = useBuilderStore((s) => s.setIsPreview);
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const past = useBuilderStore((s) => s.past);
  const future = useBuilderStore((s) => s.future);
  const saveDraft = useBuilderStore((s) => s.saveDraft);
  const publish = useBuilderStore((s) => s.publish);
  const unpublish = useBuilderStore((s) => s.unpublish);
  const saveStatus = useBuilderStore((s) => s.saveStatus);
  const isDirty = useBuilderStore((s) => s.isDirty);

  const statusLabel =
    saveStatus === "saving"
      ? "در حال ذخیره..."
      : saveStatus === "saved"
        ? "ذخیره شد"
        : isDirty
          ? "تغییرات ذخیره نشده"
          : "آماده";

  return (
    <header className="h-12 shrink-0 border-b border-border bg-white flex items-center gap-2 px-3 z-30">
      <Link
        href="/admin/pages"
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground shrink-0"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        صفحات
      </Link>
      <span className="w-px h-4 bg-border" />
      <div className="min-w-0">
        <p className="text-xs font-bold truncate">
          {page?.name || "صفحه‌ساز"}
        </p>
        <p className="text-[10px] text-muted-foreground truncate">
          {statusLabel}
          {page?.status === "published" ? " · منتشر شده" : " · پیش‌نویس"}
        </p>
      </div>

      <div className="flex-1" />

      <div className="hidden sm:flex items-center gap-0.5 p-0.5 bg-muted rounded-lg">
        {(
          [
            ["desktop", Monitor, "دسکتاپ"],
            ["tablet", Tablet, "تبلت"],
            ["mobile", Smartphone, "موبایل"],
          ] as const
        ).map(([key, Icon, label]) => (
          <button
            key={key}
            type="button"
            title={label}
            onClick={() => setPreviewDevice(key)}
            className={cn(
              "h-8 w-8 flex items-center justify-center rounded-md transition-colors",
              previewDevice === key
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>

      <span className="w-px h-4 bg-border hidden sm:block" />

      <button
        type="button"
        onClick={() => undo()}
        disabled={!past.length}
        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted disabled:opacity-30"
        title="واگرد"
      >
        <Undo2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => redo()}
        disabled={!future.length}
        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted disabled:opacity-30"
        title="ازنو"
      >
        <Redo2 className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setIsPreview(!isPreview)}
        className={cn(
          "h-8 px-2.5 flex items-center gap-1.5 rounded-md text-xs font-medium",
          isPreview ? "bg-foreground text-background" : "hover:bg-muted"
        )}
      >
        {isPreview ? (
          <EyeOff className="h-3.5 w-3.5" />
        ) : (
          <Eye className="h-3.5 w-3.5" />
        )}
        <span className="hidden md:inline">
          {isPreview ? "ویرایش" : "پیش‌نمایش"}
        </span>
      </button>

      <button
        type="button"
        onClick={() => saveDraft()}
        className="h-8 px-2.5 flex items-center gap-1.5 rounded-md text-xs font-medium border border-border hover:bg-muted"
      >
        <Save className="h-3.5 w-3.5" />
        <span className="hidden md:inline">ذخیره</span>
      </button>

      {page?.status === "published" && (
        <button
          type="button"
          onClick={() => unpublish()}
          className="h-8 px-2.5 flex items-center gap-1.5 rounded-md text-xs font-medium border border-border hover:bg-muted"
        >
          لغو انتشار
        </button>
      )}

      <button
        type="button"
        onClick={() => publish()}
        className="h-8 px-3 flex items-center gap-1.5 rounded-md text-xs font-bold bg-primary text-white hover:bg-primary-hover"
      >
        <Upload className="h-3.5 w-3.5" />
        انتشار
      </button>
    </header>
  );
}
