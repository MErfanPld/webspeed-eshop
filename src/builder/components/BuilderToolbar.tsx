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
  PanelsTopBottom,
  Search,
  Keyboard,
  MoreVertical,
  ExternalLink,
  CloudOff,
  Check,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { openCommandPalette } from "./CommandPalette";
import { useBuilderStore } from "@/builder/store/builder-store";
import { cn } from "@/lib/utils";
import { confirmDialog } from "@/components/ui/ConfirmDialog";

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
  const saveError = useBuilderStore((s) => s.saveError);
  const showSiteChrome = useBuilderStore((s) => s.showSiteChrome);
  const setShowSiteChrome = useBuilderStore((s) => s.setShowSiteChrome);

  const [showKeys, setShowKeys] = useState(false);

  const onPublish = async () => {
    const ok = await confirmDialog({
      title: "انتشار صفحه؟",
      message:
        page?.status === "published"
          ? "نسخه فعلی جایگزین نسخه منتشرشده در فروشگاه می‌شود."
          : "صفحه برای همه بازدیدکنندگان فروشگاه قابل مشاهده می‌شود.",
      confirmLabel: "انتشار",
    });
    if (ok) await publish();
  };

  const onUnpublish = async () => {
    const ok = await confirmDialog({
      title: "لغو انتشار؟",
      message: "صفحه از فروشگاه حذف می‌شود ولی پیش‌نویس آن باقی می‌ماند.",
      confirmLabel: "لغو انتشار",
      danger: true,
    });
    if (ok) await unpublish();
  };

  const statusLabel =
    saveStatus === "error"
      ? `خطا: ${saveError || "ذخیره ناموفق بود"}`
      : saveStatus === "saving"
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
            <p
              className={cn(
                "text-[10px] truncate leading-tight inline-flex items-center gap-1",
                saveStatus === "error" ? "text-red-600 font-semibold" : "text-muted-foreground"
              )}
              title={statusLabel}
              role={saveStatus === "error" ? "alert" : "status"}
            >
              {saveStatus === "saving" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : saveStatus === "error" ? (
                <AlertTriangle className="h-3 w-3" />
              ) : isDirty ? (
                <CloudOff className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3 text-emerald-600" />
              )}
              {statusLabel}
              <span
                className={cn(
                  "px-1.5 rounded-full font-semibold",
                  page?.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                )}
              >
                {page?.status === "published" ? "منتشرشده" : "پیش‌نویس"}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenLibrary}
          className="md:hidden h-9 px-2.5 rounded-lg border border-border text-xs font-medium inline-flex items-center gap-1.5 hover:bg-muted"
        >
          <Layers className="h-3.5 w-3.5 shrink-0" />
          <span>بلوک‌ها</span>
        </button>

        <div className="hidden sm:block flex-1 min-w-[0.5rem]" />

        <button
          type="button"
          onClick={openCommandPalette}
          className="hidden md:inline-flex h-8 items-center gap-2 px-2.5 rounded-lg border border-border bg-[#F7F9FB] text-xs text-muted-foreground hover:text-foreground hover:bg-white min-w-[11rem]"
          title="افزودن بلوک، رفتن به بخش‌های صفحه و اجرای دستورها"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-right">جستجو و افزودن...</span>
          <kbd className="text-[10px] border border-border rounded px-1 bg-white" dir="ltr">Ctrl K</kbd>
        </button>

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
          <button type="button" onClick={() => undo()} disabled={!past.length} className={iconBtn} title="واگرد (Ctrl+Z)" aria-label="واگرد">
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => redo()} disabled={!future.length} className={iconBtn} title="ازنو (Ctrl+Y)" aria-label="ازنو">
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

        <MoreMenu
          slug={page?.slug}
          published={page?.status === "published"}
          onUnpublish={onUnpublish}
          onShortcuts={() => setShowKeys(true)}
          toggleChrome={() => setShowSiteChrome(!showSiteChrome)}
          showChrome={showSiteChrome}
        />

        <button
          type="button"
          onClick={onPublish}
          className="h-9 sm:h-8 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover shrink-0"
        >
          <Upload className="h-3.5 w-3.5 shrink-0" />
          <span>انتشار</span>
        </button>
      </div>
      {showKeys && <ShortcutsDialog onClose={() => setShowKeys(false)} />}
    </header>
  );
}

function MoreMenu({
  slug,
  published,
  onUnpublish,
  onShortcuts,
  toggleChrome,
  showChrome,
}: {
  slug?: string;
  published: boolean;
  onUnpublish: () => void;
  onShortcuts: () => void;
  toggleChrome: () => void;
  showChrome: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  const item = "w-full flex items-center gap-2 px-3 h-9 text-xs text-right hover:bg-[#F0F5F9] rounded-lg";
  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="گزینه‌های بیشتر"
        title="گزینه‌های بیشتر"
        className="h-9 w-9 sm:h-8 sm:w-8 flex items-center justify-center rounded-lg hover:bg-muted"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-border bg-white shadow-xl p-1 z-50 ws-fade-in">
          {published && slug && (
            <a role="menuitem" href={slug} target="_blank" rel="noopener" className={item} onClick={() => setOpen(false)}>
              <ExternalLink className="h-3.5 w-3.5" /> مشاهده صفحه در فروشگاه
            </a>
          )}
          <button role="menuitem" type="button" className={item} onClick={() => { toggleChrome(); setOpen(false); }}>
            <PanelsTopBottom className="h-3.5 w-3.5" /> {showChrome ? "پنهان کردن هدر/فوتر سایت" : "نمایش هدر/فوتر سایت"}
          </button>
          <button role="menuitem" type="button" className={item} onClick={() => { onShortcuts(); setOpen(false); }}>
            <Keyboard className="h-3.5 w-3.5" /> میانبرهای صفحه‌کلید
          </button>
          {published && (
            <button role="menuitem" type="button" className={cn(item, "text-red-600 hover:bg-red-50")} onClick={() => { setOpen(false); onUnpublish(); }}>
              <CloudOff className="h-3.5 w-3.5" /> لغو انتشار
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const SHORTCUTS: [string, string][] = [
  ["Ctrl + K", "جستجو، افزودن بلوک و دستورها"],
  ["Ctrl + S", "ذخیره"],
  ["Ctrl + Z", "واگرد"],
  ["Ctrl + Shift + Z / Ctrl + Y", "انجام دوباره"],
  ["Ctrl + D", "تکرار بلوک انتخاب‌شده"],
  ["Ctrl + C / Ctrl + V", "کپی و پیست بلوک"],
  ["Ctrl + Shift + C / V", "کپی و اعمال استایل"],
  ["Alt + ↑ / ↓", "جابه‌جایی بلوک"],
  ["Delete", "حذف بلوک"],
  ["Esc", "لغو انتخاب"],
];

function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="میانبرهای صفحه‌کلید" className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-5 ws-fade-in">
        <h2 className="text-sm font-bold mb-3 inline-flex items-center gap-2"><Keyboard className="h-4 w-4" /> میانبرهای صفحه‌کلید</h2>
        <ul className="divide-y divide-border">
          {SHORTCUTS.map(([k, label]) => (
            <li key={k} className="flex items-center justify-between gap-3 py-2 text-xs">
              <span>{label}</span>
              <kbd className="font-mono text-[11px] bg-[#F0F3F6] rounded px-1.5 py-0.5" dir="ltr">{k}</kbd>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">در مک به‌جای Ctrl از ⌘ استفاده کنید.</p>
        <button type="button" onClick={onClose} className="mt-4 w-full h-9 rounded-lg bg-[#111] text-white text-xs font-semibold">بستن</button>
      </div>
    </div>
  );
}
