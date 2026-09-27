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
  Layers,
} from "lucide-react";
import { useBuilderStore } from "@/builder/store/builder-store";
import { cn } from "@/lib/utils";

type Props = {
  onOpenLibrary?: () => void;
  onOpenProps?: () => void;
};

export default function BuilderToolbar({ onOpenLibrary }: Props) {
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

  const iconBtn =
    "h-9 w-9 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg hover:bg-muted disabled:opacity-30 shrink-0";

  return (
    <header className="min-h-12 shrink-0 border-b border-border bg-white z-30">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5 px-2 sm:px-3 py-1.5 sm:py-0 sm:h-12">
        <div className="flex items-center gap-1.5 min-w-0 flex-1 sm:flex-initial">
          <Link
            href="/admin/pages"
            className="h-9 w-9 sm:h-8 sm:w-auto sm:px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
            title="بازگشت به صفحات"
          >
            <ArrowRight className="h-4 w-4 sm:h-3.5 sm:w-3.5 shrink-0" />
            <span className="hidden sm:inline">صفحات</span>
          </Link>
          <span className="hidden sm:block w-px h-4 bg-border shrink-0" />
          <div className="min-w-0 max-w-[9rem] sm:max-w-[12rem]">
            <p className="text-xs font-bold truncate leading-tight">
              {page?.name || "صفحه‌ساز"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate leading-tight">
              {statusLabel}
              {page?.status === "published" ? " · منتشر" : " · پیش‌نویس"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLibrary}
          className="lg:hidden h-9 px-2.5 rounded-lg border border-border text-xs font-medium inline-flex items-center gap-1.5 hover:bg-muted"
        >
          <Layers className="h-3.5 w-3.5 shrink-0" />
          <span>بلوک‌ها</span>
        </button>

        <div className="hidden sm:block flex-1 min-w-[0.5rem]" />

        <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-lg shrink-0">
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

        <span className="hidden md:block w-px h-4 bg-border shrink-0" />

        <div className="flex items-center gap-0.5 shrink-0">
          <button type="button" onClick={() => undo()} disabled={!past.length} className={iconBtn} title="واگرد">
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => redo()} disabled={!future.length} className={iconBtn} title="ازنو">
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={cn(
            "h-9 sm:h-8 px-2 sm:px-2.5 flex items-center gap-1.5 rounded-lg text-xs font-medium shrink-0",
            isPreview ? "bg-foreground text-background" : "hover:bg-muted"
          )}
        >
          {isPreview ? <EyeOff className="h-3.5 w-3.5 shrink-0" /> : <Eye className="h-3.5 w-3.5 shrink-0" />}
          <span className="hidden md:inline">{isPreview ? "ویرایش" : "پیش‌نمایش"}</span>
        </button>

        <button
          type="button"
          onClick={() => saveDraft()}
          className="h-9 sm:h-8 px-2 sm:px-2.5 flex items-center gap-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted shrink-0"
        >
          <Save className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline">ذخیره</span>
        </button>

        {page?.status === "published" && (
          <button
            type="button"
            onClick={() => unpublish()}
            className="h-9 sm:h-8 px-2 sm:px-2.5 flex items-center gap-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted shrink-0"
          >
            <span className="text-[11px] sm:text-xs">لغو انتشار</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => publish()}
          className="h-9 sm:h-8 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover shrink-0"
        >
          <Upload className="h-3.5 w-3.5 shrink-0" />
          <span>انتشار</span>
        </button>
      </div>
    </header>
  );
}
