"use client";

import { useBuilderStore } from "@/builder/store/builder-store";
import { getBlockDefinition } from "@/builder/registry/block-registry";
import FieldRenderer from "./FieldRenderer";
import { Settings2 } from "lucide-react";

function getPathValue(data: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let cur: unknown = data;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

export default function PropertiesPanel() {
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const blocks = useBuilderStore((s) => s.blocks);
  const updateBlockData = useBuilderStore((s) => s.updateBlockData);

  const block = blocks.find((b) => b.id === selectedBlockId);
  const def = block ? getBlockDefinition(block.type) : undefined;

  if (!block || !def) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center">
        <Settings2 className="h-8 w-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-foreground">ویژگی‌ها</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          یک بلوک را در بوم انتخاب کنید تا تنظیمات آن را ویرایش کنید.
        </p>
      </div>
    );
  }

  const data = (block as { data: Record<string, unknown> }).data || {};

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <p className="text-[11px] font-medium text-muted-foreground">بلوک</p>
        <h2 className="text-sm font-bold mt-0.5">{def.nameFa}</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
          {block.type}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {def.schema.map((field) => (
          <FieldRenderer
            key={field.path}
            field={field}
            value={getPathValue(data, field.path)}
            onChange={(v) => updateBlockData(block.id, field.path, v)}
          />
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
