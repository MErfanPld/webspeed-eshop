"use client";

import { useMemo } from "react";
import { useBuilderStore } from "@/builder/store/builder-store";
import { getBlockDefinition } from "@/builder/registry/block-registry";
import FieldRenderer from "./FieldRenderer";
import { Settings2, Monitor, Tablet, Smartphone, FileText } from "lucide-react";
import type { FieldSchema } from "@/builder/schema-types";

function getPathValue(data: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let cur: unknown = data;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

const GROUP_ORDER = [
  "محتوا",
  "برند",
  "اقدامات",
  "چیدمان",
  "تایپوگرافی",
  "فاصله",
  "پس‌زمینه",
  "حاشیه",
  "جلوه‌ها",
  "رفتار",
  "پیشرفته",
];

export default function PropertiesPanel() {
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const blocks = useBuilderStore((s) => s.blocks);
  const page = useBuilderStore((s) => s.page);
  const updateBlockData = useBuilderStore((s) => s.updateBlockData);
  const updatePageMeta = useBuilderStore((s) => s.updatePageMeta);
  const copyStyle = useBuilderStore((s) => s.copyStyle);
  const pasteStyle = useBuilderStore((s) => s.pasteStyle);
  const previewDevice = useBuilderStore((s) => s.previewDevice);

  const block = blocks.find((b) => b.id === selectedBlockId);
  const def = block ? getBlockDefinition(block.type) : undefined;

  // Hooks must run unconditionally (before any early return)
  const groups = useMemo(() => {
    const schema = def?.schema ?? [];
    const map = new Map<string, FieldSchema[]>();
    for (const field of schema) {
      const g = field.group || "محتوا";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(field);
    }
    const ordered: { name: string; fields: FieldSchema[] }[] = [];
    for (const name of GROUP_ORDER) {
      if (map.has(name)) {
        ordered.push({ name, fields: map.get(name)! });
        map.delete(name);
      }
    }
    map.forEach((fields, name) => ordered.push({ name, fields }));
    return ordered;
  }, [def?.schema]);

  if (!block || !def) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-bold">تنظیمات صفحه</p>
              <p className="text-[11px] text-muted-foreground">نام، مسیر و SEO</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {!page ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              صفحه‌ای بارگذاری نشده
            </p>
          ) : (
            <>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  نام صفحه
                </span>
                <input
                  value={page.name || ""}
                  onChange={(e) => updatePageMeta({ name: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">Slug</span>
                <input
                  value={page.slug || ""}
                  onChange={(e) => updatePageMeta({ slug: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm font-mono dir-ltr text-left"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  توضیح
                </span>
                <textarea
                  value={page.description || ""}
                  onChange={(e) => updatePageMeta({ description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm resize-none"
                />
              </label>
              <div className="pt-2 border-t border-border space-y-3">
                <p className="text-[11px] font-bold text-muted-foreground">SEO</p>
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    SEO Title
                  </span>
                  <input
                    value={(page.seo as { title?: string } | undefined)?.title || ""}
                    onChange={(e) => updatePageMeta({ seoTitle: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-white text-sm"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    SEO Description
                  </span>
                  <textarea
                    value={
                      (page.seo as { description?: string } | undefined)?.description || ""
                    }
                    onChange={(e) =>
                      updatePageMeta({ seoDescription: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm resize-none"
                  />
                </label>
              </div>
              <div className="rounded-xl bg-muted/50 p-3 text-[11px] text-muted-foreground leading-relaxed">
                Status:{" "}
                <span className="font-semibold text-foreground">
                  {page.status === "published" ? "published" : "draft"}
                </span>
              </div>
            </>
          )}
          <div className="pt-4 text-center">
            <Settings2 className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-[11px] text-muted-foreground">
              یک بلوک را انتخاب کنید تا ویژگی‌های آن را ویرایش کنید.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const data = (block as { data: Record<string, unknown> }).data || {};
  const vis = (data._visibility as Record<string, boolean>) || {
    desktop: true,
    tablet: true,
    mobile: true,
  };

  const setVis = (key: "desktop" | "tablet" | "mobile", value: boolean) => {
    updateBlockData(block.id, "_visibility", { ...vis, [key]: value });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border space-y-2">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">بلوک</p>
          <h2 className="text-sm font-bold mt-0.5">
            {String(data._label || def.nameFa)}
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
            {block.type}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => copyStyle(block.id)}
            className="flex-1 h-8 rounded-lg border border-border text-[10px] font-semibold hover:bg-muted"
          >
            کپی استایل
          </button>
          <button
            type="button"
            onClick={() => pasteStyle(block.id)}
            className="flex-1 h-8 rounded-lg border border-border text-[10px] font-semibold hover:bg-muted"
          >
            پیست استایل
          </button>
        </div>
      </div>

      <div className="p-3 border-b border-border">
        <p className="text-[11px] font-semibold text-muted-foreground mb-2">
          نمایش در دستگاه
        </p>
        <div className="flex gap-1">
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
              onClick={() => setVis(key, vis[key] === false)}
              className={`flex-1 h-9 rounded-lg border text-[10px] font-medium inline-flex flex-col items-center justify-center gap-0.5 ${
                vis[key] !== false
                  ? "border-[#111] bg-[#111] text-white"
                  : "border-border text-muted-foreground opacity-60"
              } ${previewDevice === key ? "ring-2 ring-[#E31B23]/40" : ""}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {groups.map((g) => (
          <div key={g.name} className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {g.name}
            </p>
            {g.fields.map((field) => (
              <FieldRenderer
                key={field.path}
                field={field}
                value={getPathValue(data, field.path)}
                onChange={(v) => updateBlockData(block.id, field.path, v)}
              />
            ))}
          </div>
        ))}
        {!def.schema.length && (
          <p className="text-xs text-muted-foreground">
            فیلد قابل ویرایشی تعریف نشده است.
          </p>
        )}
      </div>
    </div>
  );
}
