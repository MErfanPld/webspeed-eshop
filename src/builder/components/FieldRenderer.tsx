"use client";

import { useState } from "react";
import type { FieldSchema } from "@/builder/schema-types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { newId } from "@/builder/registry/block-registry";
import { useCatalog } from "@/context/CatalogContext";
import MediaPickerButton from "./MediaPickerButton";

type Props = {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  depth?: number;
};

const inputClass =
  "w-full h-9 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20";

function getAt(obj: unknown, path: string): unknown {
  if (!path) return obj;
  let cur: unknown = obj;
  for (const p of path.split(".")) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

function Label({ field }: { field: FieldSchema }) {
  return (
    <span className="block text-xs font-medium text-muted-foreground">
      {field.label}
      {field.description && (
        <span className="block text-[10px] font-normal opacity-80 mt-0.5">
          {field.description}
        </span>
      )}
    </span>
  );
}

const HEX = /^#[0-9a-fA-F]{6}$/;

/** ISO → value for <input type="datetime-local"> (local time) */
function isoToLocalInput(v: unknown): string {
  if (typeof v !== "string" || !v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ProductIdsField({ field, value, onChange }: Props) {
  const { products } = useCatalog();
  const [q, setQ] = useState("");
  const selected = Array.isArray(value) ? (value as string[]) : [];
  const filtered = products
    .filter((p) => !q.trim() || p.name.includes(q.trim()) || p.slug.includes(q.trim().toLowerCase()))
    .slice(0, 30);
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  return (
    <div className="space-y-1.5">
      <Label field={field} />
      <input
        className={inputClass}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="جستجوی محصول..."
      />
      <div className="max-h-44 overflow-y-auto rounded-lg border border-border divide-y divide-border">
        {filtered.map((p) => (
          <label key={p.id} className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer hover:bg-muted">
            <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />
            <span className="truncate">{p.name}</span>
          </label>
        ))}
        {!filtered.length && <p className="p-2 text-[11px] text-muted-foreground">محصولی یافت نشد</p>}
      </div>
      {selected.length > 0 && (
        <button type="button" className="text-[11px] text-primary font-semibold" onClick={() => onChange([])}>
          پاک کردن انتخاب ({selected.length})
        </button>
      )}
    </div>
  );
}

function ArrayField({ field, value, onChange, depth = 0 }: Props) {
  const list = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const keyOf = (item: Record<string, unknown>, i: number) => String(item.id ?? i);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length) return;
    const next = [...list];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange(next);
  };

  const titleOf = (item: Record<string, unknown>, i: number) => {
    const first = field.itemFields?.find((f) => f.type === "text");
    const t = first ? getAt(item, first.path) : undefined;
    return typeof t === "string" && t.trim() ? t : `#${i + 1}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {field.label} <span className="opacity-60">({list.length})</span>
        </span>
        <button
          type="button"
          className="text-xs font-semibold text-primary flex items-center gap-1"
          onClick={() => {
            const item = structuredClone(field.defaultItem || {}) as Record<string, unknown>;
            item.id = newId("item");
            onChange([...list, item]);
            setOpen((o) => ({ ...o, [String(item.id)]: true }));
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          افزودن
        </button>
      </div>
      <div className="space-y-2">
        {list.map((item, index) => {
          const k = keyOf(item, index);
          const isOpen = open[k] ?? list.length <= 2;
          return (
            <div key={k} className="rounded-xl border border-border bg-[#fafafa]">
              <div className="flex items-center gap-1 px-2 py-1.5">
                <button
                  type="button"
                  className="flex-1 min-w-0 text-right text-[11px] font-semibold text-foreground truncate"
                  onClick={() => setOpen((o) => ({ ...o, [k]: !isOpen }))}
                  aria-expanded={isOpen}
                >
                  {titleOf(item, index)}
                </button>
                <button type="button" className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-white disabled:opacity-30" disabled={index === 0} onClick={() => move(index, index - 1)} aria-label="بالا">
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-white disabled:opacity-30" disabled={index === list.length - 1} onClick={() => move(index, index + 1)} aria-label="پایین">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="h-6 w-6 inline-flex items-center justify-center rounded text-muted-foreground hover:text-red-600 hover:bg-white"
                  onClick={() => onChange(list.filter((_, i) => i !== index))}
                  aria-label="حذف"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {isOpen && (
                <div className="px-3 pb-3 space-y-2">
                  {field.itemFields!.map((sub) => (
                    <FieldRenderer
                      key={sub.path}
                      field={sub}
                      depth={depth + 1}
                      value={getAt(item, sub.path)}
                      onChange={(v) =>
                        onChange(list.map((it, i) => (i === index ? { ...it, [sub.path]: v } : it)))
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {!list.length && (
          <p className="text-xs text-muted-foreground text-center py-3 border border-dashed border-border rounded-xl">
            موردی اضافه نشده
          </p>
        )}
      </div>
    </div>
  );
}

export default function FieldRenderer(props: Props) {
  const { field, value, onChange } = props;

  switch (field.type) {
    case "text":
    case "url":
      return (
        <label className="block space-y-1.5">
          <Label field={field} />
          <input
            type="text"
            dir={field.type === "url" ? "ltr" : undefined}
            className={cn(inputClass, field.type === "url" && "text-left font-mono text-xs")}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      );

    case "textarea":
      return (
        <label className="block space-y-1.5">
          <Label field={field} />
          <textarea
            className={cn(inputClass, "h-24 py-2 resize-y")}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      );

    case "number":
      return (
        <label className="block space-y-1.5">
          <Label field={field} />
          <input
            type="number"
            className={inputClass}
            value={value === undefined || value === null || value === "" ? "" : Number(value)}
            min={field.min}
            max={field.max}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </label>
      );

    case "responsiveNumber": {
      const obj =
        value && typeof value === "object"
          ? (value as { desktop?: number; tablet?: number; mobile?: number })
          : typeof value === "number"
            ? { desktop: value }
            : {};
      const labels = { desktop: "دسکتاپ", tablet: "تبلت", mobile: "موبایل" } as const;
      return (
        <div className="space-y-1.5">
          <Label field={field} />
          <div className="grid grid-cols-3 gap-1.5">
            {(["desktop", "tablet", "mobile"] as const).map((key) => (
              <label key={key} className="block space-y-1">
                <span className="text-[10px] text-muted-foreground">{labels[key]}</span>
                <input
                  type="number"
                  className={cn(inputClass, "px-2")}
                  value={obj[key] ?? ""}
                  min={field.min}
                  max={field.max}
                  placeholder="—"
                  onChange={(e) =>
                    onChange({
                      ...obj,
                      [key]: e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                />
              </label>
            ))}
          </div>
        </div>
      );
    }

    case "boolean":
      return (
        <div className="flex items-center justify-between gap-3 py-1">
          <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
          <button
            type="button"
            role="switch"
            aria-checked={Boolean(value)}
            aria-label={field.label}
            onClick={() => onChange(!value)}
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              value ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                value ? "right-0.5" : "right-[22px]"
              )}
            />
          </button>
        </div>
      );

    case "select":
      if (!field.options?.length) return null;
      return (
        <label className="block space-y-1.5">
          <Label field={field} />
          <select
            className={inputClass}
            value={String(value ?? field.defaultValue ?? "")}
            onChange={(e) => {
              const opt = field.options!.find((o) => String(o.value) === e.target.value);
              onChange(opt ? opt.value : e.target.value);
            }}
          >
            {value === undefined && field.defaultValue === undefined && <option value="">—</option>}
            {field.options.map((o) => (
              <option key={String(o.value)} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      );

    case "color": {
      const str = typeof value === "string" ? value : "";
      return (
        <label className="block space-y-1.5">
          <Label field={field} />
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="h-9 w-12 shrink-0 rounded border border-border cursor-pointer"
              value={HEX.test(str) ? str : "#ffffff"}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="text"
              dir="ltr"
              className={cn(inputClass, "font-mono text-xs")}
              value={str}
              placeholder="transparent"
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </label>
      );
    }

    case "image":
      return (
        <div className="space-y-1.5">
          <Label field={field} />
          <div className="flex gap-1.5">
            <input
              type="text"
              dir="ltr"
              className={cn(inputClass, "font-mono text-xs")}
              value={String(value ?? "")}
              placeholder="/placeholders/..."
              onChange={(e) => onChange(e.target.value)}
            />
            <MediaPickerButton onPick={(url) => onChange(url)} />
          </div>
          {typeof value === "string" && value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="mt-1 h-16 w-full object-cover rounded-lg border border-border bg-muted" />
          ) : null}
        </div>
      );

    case "datetime":
      return (
        <label className="block space-y-1.5">
          <Label field={field} />
          <input
            type="datetime-local"
            className={inputClass}
            value={isoToLocalInput(value)}
            onChange={(e) =>
              onChange(e.target.value ? new Date(e.target.value).toISOString() : "")
            }
          />
        </label>
      );

    case "productIds":
      return <ProductIdsField {...props} />;

    case "array":
      if (!field.itemFields) return null;
      return <ArrayField {...props} />;

    default:
      return null;
  }
}
