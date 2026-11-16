"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Lock,
  LockOpen,
  Monitor,
  MousePointerClick,
  Paintbrush,
  SlidersHorizontal,
  Smartphone,
  Tablet,
  Trash2,
  Type,
} from "lucide-react";
import { isLocked, useBuilderStore } from "@/builder/store/builder-store";
import * as tree from "@/builder/store/tree";
import { getBlockDefinition, COMMON_FIELDS } from "@/builder/registry/block-registry";
import { confirmAndRemove } from "@/builder/hooks/shortcuts";
import type { FieldSchema } from "@/builder/schema-types";
import type { PageBlock } from "@/builder/types";
import { cn } from "@/lib/utils";
import FieldRenderer from "./FieldRenderer";

function getPathValue(data: Record<string, unknown>, path: string): unknown {
  let cur: unknown = data;
  for (const p of path.split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

/** Field groups → tabs, so long schemas don't become one endless scroll */
type TabKey = "content" | "design" | "advanced";
const TABS: { key: TabKey; label: string; icon: typeof Type }[] = [
  { key: "content", label: "محتوا", icon: Type },
  { key: "design", label: "طراحی", icon: Paintbrush },
  { key: "advanced", label: "پیشرفته", icon: SlidersHorizontal },
];
const GROUP_TAB: Record<string, TabKey> = {
  محتوا: "content",
  برند: "content",
  اقدامات: "content",
  داده: "content",
  زمان: "content",
  منو: "content",
  "لینک‌ها": "content",
  تماس: "content",
  خبرنامه: "content",
  فیلدها: "content",
  چیدمان: "design",
  تایپوگرافی: "design",
  فاصله: "design",
  "پس‌زمینه": "design",
  حاشیه: "design",
  "جلوه‌ها": "design",
  ظاهر: "design",
  رفتار: "advanced",
  پیشرفته: "advanced",
};
const GROUP_ORDER = Object.keys(GROUP_TAB);

const labelOf = (b: PageBlock) =>
  String((b as { data?: Record<string, unknown> }).data?._label || getBlockDefinition(b.type)?.nameFa || b.type);

/** Ancestors of the selected block (root → parent), for the breadcrumb */
function pathTo(blocks: PageBlock[], id: string): PageBlock[] {
  const out: PageBlock[] = [];
  let loc = tree.findBlock(blocks, id);
  while (loc?.parentId) {
    const parent = tree.findBlock(blocks, loc.parentId);
    if (!parent) break;
    out.unshift(parent.block);
    loc = parent;
  }
  return out;
}

export default function PropertiesPanel() {
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const blocks = useBuilderStore((s) => s.blocks);
  const updateBlockData = useBuilderStore((s) => s.updateBlockData);
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const copyStyle = useBuilderStore((s) => s.copyStyle);
  const pasteStyle = useBuilderStore((s) => s.pasteStyle);
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock);
  const moveBlockById = useBuilderStore((s) => s.moveBlockById);
  const setBlockLocked = useBuilderStore((s) => s.setBlockLocked);
  const toggleBlockEnabled = useBuilderStore((s) => s.toggleBlockEnabled);
  const renameBlock = useBuilderStore((s) => s.renameBlock);
  const [tab, setTab] = useState<TabKey>("content");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Nested blocks (inside columns/sections) must be editable too
  const loc = selectedBlockId ? tree.findBlock(blocks, selectedBlockId) : null;
  const block = loc?.block;
  const def = block ? getBlockDefinition(block.type) : undefined;

  const groups = useMemo(() => {
    const schema = def ? [...def.schema, ...COMMON_FIELDS] : [];
    const map = new Map<string, FieldSchema[]>();
    for (const field of schema) {
      const g = field.group || "محتوا";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(field);
    }
    const names = [...GROUP_ORDER.filter((n) => map.has(n)), ...[...map.keys()].filter((n) => !GROUP_TAB[n])];
    return names.map((name) => ({ name, tab: GROUP_TAB[name] ?? ("content" as TabKey), fields: map.get(name)! }));
  }, [def]);

  if (!block) return <PageSettings />;

  if (!def) {
    return (
      <div className="p-4 space-y-3 text-xs">
        <p className="font-bold text-red-700">بلوک ناشناخته</p>
        <p className="text-muted-foreground leading-6">
          نوع <code className="font-mono">{block.type}</code> در رجیستری تعریف نشده و قابل ویرایش نیست.
        </p>
        <button type="button" onClick={() => void confirmAndRemove(block.id)} className="h-9 px-3 rounded-lg bg-red-600 text-white text-xs font-semibold">
          حذف بلوک
        </button>
      </div>
    );
  }

  const data = (block as { data: Record<string, unknown> }).data || {};
  const locked = isLocked(block);
  const siblings = tree.getSiblings(blocks, loc!.parentId);
  const ancestors = pathTo(blocks, block.id);
  const vis = (data._visibility as Record<string, boolean>) || {};
  const setVis = (key: "desktop" | "tablet" | "mobile") =>
    updateBlockData(block.id, "_visibility", { desktop: true, tablet: true, mobile: true, ...vis, [key]: vis[key] === false });

  const counts = Object.fromEntries(TABS.map((t) => [t.key, groups.filter((g) => g.tab === t.key).length]));
  // A tab without fields for this block is hidden; fall back to the first available one
  const current: TabKey = tab === "advanced" || counts[tab] > 0 ? tab : counts.content > 0 ? "content" : counts.design > 0 ? "design" : "advanced";
  const tabGroups = groups.filter((g) => g.tab === current);
  const actionBtn =
    "h-8 w-8 rounded-lg inline-flex items-center justify-center text-[#5A6A85] hover:bg-[#F0F5F9] hover:text-[#111] disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="flex flex-col h-full" data-testid="properties-panel">
      <div className="p-3 border-b border-border space-y-2.5 shrink-0">
        {/* Breadcrumb: jump to any parent container */}
        <nav aria-label="مسیر بلوک" className="flex items-center flex-wrap gap-0.5 text-[11px] text-muted-foreground">
          <button type="button" onClick={() => selectBlock(null)} className="hover:text-foreground hover:underline">
            صفحه
          </button>
          {ancestors.map((a) => (
            <span key={a.id} className="inline-flex items-center gap-0.5">
              <ChevronLeft className="h-3 w-3" />
              <button type="button" onClick={() => selectBlock(a.id)} className="hover:text-foreground hover:underline">
                {labelOf(a)}
              </button>
            </span>
          ))}
        </nav>

        <input
          key={`${block.id}:${String(data._label ?? "")}`}
          aria-label="نام بلوک"
          defaultValue={String(data._label ?? "")}
          placeholder={def.nameFa}
          // Commit on blur/Enter (renaming trims, so committing per keystroke would eat spaces)
          onBlur={(e) => e.target.value !== String(data._label ?? "") && renameBlock(block.id, e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          className="w-full h-9 px-2 -mx-2 rounded-lg bg-transparent text-sm font-bold placeholder:text-[#111] hover:bg-[#F7F9FB] focus:bg-white focus:placeholder:text-[#B0BAC5] focus:ring-2 focus:ring-[#111]/10 outline-none"
          title="تغییر نام بلوک (فقط در صفحه‌ساز دیده می‌شود)"
        />

        <div className="flex items-center gap-0.5 -mx-1" role="toolbar" aria-label="عملیات بلوک">
          <button type="button" className={actionBtn} disabled={locked || loc!.index === 0} onClick={() => moveBlockById(block.id, "up")} title="بالا (Alt+↑)" aria-label="انتقال به بالا">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" className={actionBtn} disabled={locked || loc!.index >= siblings.length - 1} onClick={() => moveBlockById(block.id, "down")} title="پایین (Alt+↓)" aria-label="انتقال به پایین">
            <ChevronDown className="h-4 w-4" />
          </button>
          <button type="button" className={actionBtn} onClick={() => duplicateBlock(block.id)} title="تکرار (Ctrl+D)" aria-label="تکرار بلوک">
            <Copy className="h-4 w-4" />
          </button>
          <button type="button" className={actionBtn} onClick={() => toggleBlockEnabled(block.id)} title={block.enabled === false ? "فعال کردن" : "غیرفعال کردن (در سایت نمایش داده نمی‌شود)"} aria-label={block.enabled === false ? "فعال کردن بلوک" : "غیرفعال کردن بلوک"}>
            {block.enabled === false ? <EyeOff className="h-4 w-4 text-amber-600" /> : <Eye className="h-4 w-4" />}
          </button>
          <button type="button" className={actionBtn} onClick={() => setBlockLocked(block.id, !locked)} title={locked ? "باز کردن قفل" : "قفل (جلوگیری از جابه‌جایی و حذف)"} aria-label={locked ? "باز کردن قفل" : "قفل بلوک"}>
            {locked ? <Lock className="h-4 w-4 text-amber-600" /> : <LockOpen className="h-4 w-4" />}
          </button>
          <span className="flex-1" />
          <button type="button" className={cn(actionBtn, "text-red-600 hover:bg-red-50 hover:text-red-700")} disabled={locked} onClick={() => void confirmAndRemove(block.id)} title="حذف (Delete)" aria-label="حذف بلوک">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex shrink-0 border-b border-border px-2" role="tablist" aria-label="بخش‌های تنظیمات">
        {TABS.filter((t) => t.key === "advanced" || counts[t.key] > 0).map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={current === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 h-10 inline-flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 -mb-px transition-colors",
              current === t.key ? "border-[#111] text-[#111]" : "border-transparent text-[#7C8FAC] hover:text-[#111]"
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3" role="tabpanel">
        {current === "advanced" && (
          <section className="rounded-xl border border-border p-3 space-y-2">
            <p className="text-[11px] font-bold text-[#2A3547]">نمایش در دستگاه‌ها</p>
            {(
              [
                ["desktop", Monitor, "دسکتاپ"],
                ["tablet", Tablet, "تبلت"],
                ["mobile", Smartphone, "موبایل"],
              ] as const
            ).map(([key, Icon, label]) => {
              const on = vis[key] !== false;
              return (
                <label key={key} className="flex items-center gap-2 text-xs cursor-pointer">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="flex-1">{label}</span>
                  <span className={cn("text-[10px]", on ? "text-emerald-700" : "text-muted-foreground")}>{on ? "نمایش" : "مخفی"}</span>
                  <input type="checkbox" role="switch" checked={on} onChange={() => setVis(key)} className="sr-only peer" aria-label={`نمایش در ${label}`} />
                  <span className="relative h-5 w-9 rounded-full bg-[#D6DEE6] peer-checked:bg-[#111] transition-colors after:absolute after:top-0.5 after:right-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:-translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-[#111]/30" />
                </label>
              );
            })}
            <div className="flex gap-1.5 pt-1">
              <button type="button" onClick={() => copyStyle(block.id)} className="flex-1 h-8 rounded-lg border border-border text-[11px] font-semibold hover:bg-muted" title="Ctrl+Shift+C">
                کپی استایل
              </button>
              <button type="button" onClick={() => pasteStyle(block.id)} className="flex-1 h-8 rounded-lg border border-border text-[11px] font-semibold hover:bg-muted" title="Ctrl+Shift+V">
                اعمال استایل کپی‌شده
              </button>
            </div>
          </section>
        )}

        {!tabGroups.length && current !== "advanced" && (
          <p className="text-xs text-muted-foreground text-center py-8">این بلوک در این بخش تنظیمی ندارد.</p>
        )}

        {tabGroups.map((g) => {
          const isCollapsed = collapsed[g.name];
          return (
            <section key={g.name} className="rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setCollapsed((c) => ({ ...c, [g.name]: !isCollapsed }))}
                aria-expanded={!isCollapsed}
                className="w-full flex items-center justify-between px-3 h-9 text-[11px] font-bold text-[#2A3547]"
              >
                {g.name}
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", isCollapsed && "rotate-90")} />
              </button>
              {!isCollapsed && (
                <div className="px-3 pb-3 space-y-3">
                  {g.fields.map((field) => (
                    <FieldRenderer
                      key={field.path}
                      field={field}
                      value={getPathValue(data, field.path)}
                      onChange={(v) => updateBlockData(block.id, field.path, v)}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** Shown when nothing is selected: page name, address and SEO */
function PageSettings() {
  const page = useBuilderStore((s) => s.page);
  const updatePageMeta = useBuilderStore((s) => s.updatePageMeta);
  const input = "w-full h-9 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#111]/10";
  const seo = (page?.seo ?? {}) as { title?: string; description?: string };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1">
          <p className="text-sm font-bold">تنظیمات صفحه</p>
          <p className="text-[11px] text-muted-foreground">نام، آدرس و سئو</p>
        </div>
        {page && (
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full",
              page.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            )}
          >
            {page.status === "published" ? "منتشرشده" : "پیش‌نویس"}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {!page ? (
          <p className="text-xs text-muted-foreground text-center py-8">صفحه‌ای بارگذاری نشده</p>
        ) : (
          <>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground">نام صفحه</span>
              <input value={page.name || ""} onChange={(e) => updatePageMeta({ name: e.target.value })} className={input} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground">آدرس صفحه (اسلاگ)</span>
              <input value={page.slug || ""} onChange={(e) => updatePageMeta({ slug: e.target.value })} className={cn(input, "font-mono text-left")} dir="ltr" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground">توضیح داخلی</span>
              <textarea value={page.description || ""} onChange={(e) => updatePageMeta({ description: e.target.value })} rows={2} className={cn(input, "h-auto py-2 resize-none")} />
            </label>
            <div className="pt-3 border-t border-border space-y-3">
              <p className="text-[11px] font-bold text-[#2A3547]">سئو (نمایش در گوگل)</p>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">عنوان سئو</span>
                <input value={seo.title || ""} onChange={(e) => updatePageMeta({ seoTitle: e.target.value })} className={input} maxLength={70} />
                <span className="block text-[10px] text-muted-foreground text-left tabular-nums">{(seo.title || "").length}/70</span>
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">توضیحات سئو</span>
                <textarea value={seo.description || ""} onChange={(e) => updatePageMeta({ seoDescription: e.target.value })} rows={3} maxLength={160} className={cn(input, "h-auto py-2 resize-none")} />
                <span className="block text-[10px] text-muted-foreground text-left tabular-nums">{(seo.description || "").length}/160</span>
              </label>
              {/* Search result preview */}
              <div className="rounded-xl border border-border p-3 space-y-0.5 bg-[#FAFBFC]">
                <p className="text-[13px] text-[#1a0dab] truncate">{seo.title || page.name}</p>
                <p className="text-[11px] text-[#006621] truncate" dir="ltr">{page.slug}</p>
                <p className="text-[11px] text-[#545454] line-clamp-2 leading-5">{seo.description || page.description || "توضیحی وارد نشده"}</p>
              </div>
            </div>
          </>
        )}
        <div className="pt-2 text-center">
          <MousePointerClick className="h-6 w-6 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-[11px] text-muted-foreground leading-5">برای ویرایش، روی یک بلوک در بوم یا در «لایه‌ها» کلیک کنید.</p>
        </div>
      </div>
    </div>
  );
}
