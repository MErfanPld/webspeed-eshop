"use client";

import type { FieldSchema } from "@/builder/schema-types";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  depth?: number;
};

function getAt(obj: unknown, path: string): unknown {
  if (!path) return obj;
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

export default function FieldRenderer({
  field,
  value,
  onChange,
  depth = 0,
}: Props) {
  const inputClass =
    "w-full h-9 rounded-lg border border-border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20";

  if (field.type === "text" || field.type === "url") {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {field.label}
        </span>
        <input
          type="text"
          className={inputClass}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {field.label}
        </span>
        <textarea
          className={cn(inputClass, "h-24 py-2 resize-y")}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  if (field.type === "number") {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {field.label}
        </span>
        <input
          type="number"
          className={inputClass}
          value={value === undefined || value === null ? "" : Number(value)}
          min={field.min}
          max={field.max}
          onChange={(e) =>
            onChange(e.target.value === "" ? undefined : Number(e.target.value))
          }
        />
      </label>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center justify-between gap-3 py-1">
        <span className="text-xs font-medium text-muted-foreground">
          {field.label}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            value ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
              value ? "left-0.5" : "left-[22px]"
            )}
          />
        </button>
      </label>
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {field.label}
        </span>
        <select
          className={inputClass}
          value={String(value ?? "")}
          onChange={(e) => {
            const opt = field.options!.find(
              (o) => String(o.value) === e.target.value
            );
            onChange(opt ? opt.value : e.target.value);
          }}
        >
          {field.options.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "image") {
    return (
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {field.label}
        </span>
        <input
          type="text"
          className={inputClass}
          value={String(value ?? "")}
          placeholder="/placeholders/..."
          onChange={(e) => onChange(e.target.value)}
        />
        {typeof value === "string" && value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="mt-1 h-16 w-full object-cover rounded-lg border border-border bg-muted"
          />
        ) : null}
      </label>
    );
  }

  if (field.type === "array" && field.itemFields) {
    const list = Array.isArray(value)
      ? (value as Record<string, unknown>[])
      : [];
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {field.label}
          </span>
          <button
            type="button"
            className="text-xs font-semibold text-primary flex items-center gap-1"
            onClick={() => {
              const item = structuredClone(
                field.defaultItem || {}
              ) as Record<string, unknown>;
              if (!item.id) item.id = `item-${Date.now()}`;
              onChange([...list, item]);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            افزودن
          </button>
        </div>
        <div className="space-y-3">
          {list.map((item, index) => (
            <div
              key={String(item.id ?? index)}
              className="rounded-xl border border-border p-3 space-y-2 bg-[#fafafa]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  #{index + 1}
                </span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => onChange(list.filter((_, i) => i !== index))}
                  aria-label="حذف"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {field.itemFields!.map((sub) => (
                <FieldRenderer
                  key={sub.path}
                  field={sub}
                  depth={depth + 1}
                  value={getAt(item, sub.path)}
                  onChange={(v) => {
                    const next = list.map((it, i) => {
                      if (i !== index) return it;
                      return { ...it, [sub.path]: v };
                    });
                    onChange(next);
                  }}
                />
              ))}
            </div>
          ))}
          {!list.length && (
            <p className="text-xs text-muted-foreground text-center py-3 border border-dashed border-border rounded-xl">
              موردی اضافه نشده
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
