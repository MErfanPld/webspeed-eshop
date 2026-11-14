"use client";

import { useState } from "react";
import { builderActions, isLocked, useBuilderStore } from "@/builder/store/builder-store";
import { getBlockDefinition } from "@/builder/registry/block-registry";
import * as tree from "@/builder/store/tree";
import type { PageBlock } from "@/builder/types";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  Lock,
  LockOpen,
  Pencil,
} from "lucide-react";
import {
  cancelDrag,
  commitDrop,
  computeDropTarget,
  getDrag,
  startDrag,
} from "@/builder/dnd/drag-state";
import { confirmAndRemove } from "@/builder/hooks/shortcuts";

function labelOf(block: PageBlock): string {
  const data = (block as { data?: Record<string, unknown> }).data || {};
  return String(data._label || getBlockDefinition(block.type)?.nameFa || block.type);
}

function Row({
  block,
  depth,
  index,
  siblings,
}: {
  block: PageBlock;
  depth: number;
  index: number;
  siblings: number;
}) {
  const blocks = useBuilderStore((s) => s.blocks);
  const selected = useBuilderStore((s) => s.selectedBlockId === block.id);
  const indicator = useBuilderStore((s) =>
    s.dropTarget?.anchorId === block.id ? s.dropTarget.position : null
  );
  const a = builderActions;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const locked = isLocked(block);
  const disabled = block.enabled === false;
  const iconBtn = "h-6 w-6 inline-flex items-center justify-center rounded hover:bg-black/10 disabled:opacity-30";

  return (
    <li>
      <div
        className={cn(
          "relative group flex items-center gap-1 rounded-lg py-1.5 pl-1 text-xs cursor-pointer",
          selected ? "bg-foreground text-background" : "hover:bg-muted text-foreground",
          disabled && "opacity-50"
        )}
        style={{ paddingRight: 8 + depth * 14 }}
        draggable={!locked && !editing}
        onDragStart={(e) => startDrag(e, { kind: "move", id: block.id, type: block.type })}
        onDragEnd={() => cancelDrag()}
        onDragOver={(e) => {
          if (!getDrag()) return;
          e.preventDefault();
          a.setDropTarget(computeDropTarget(blocks, block.id, e.currentTarget.getBoundingClientRect(), e.clientY));
        }}
        onDrop={(e) => {
          e.preventDefault();
          commitDrop();
        }}
        onClick={() => a.selectBlock(block.id)}
        onDoubleClick={() => {
          setDraft(labelOf(block));
          setEditing(true);
        }}
      >
        {indicator === "before" && <span className="absolute inset-x-1 -top-px h-0.5 rounded bg-[#5D87FF]" />}
        {indicator === "after" && <span className="absolute inset-x-1 -bottom-px h-0.5 rounded bg-[#5D87FF]" />}
        {indicator === "inside" && <span className="absolute inset-0 rounded-lg ring-2 ring-[#5D87FF] pointer-events-none" />}

        {locked && <Lock className="h-3 w-3 shrink-0 opacity-70" />}
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => {
              a.renameBlock(block.id, draft);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") setEditing(false);
            }}
            className="flex-1 min-w-0 h-6 rounded border border-border bg-white px-1.5 text-xs text-foreground"
          />
        ) : (
          <span className="truncate flex-1 font-medium">{labelOf(block)}</span>
        )}
        <span className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
          <button type="button" className={iconBtn} disabled={locked || index === 0} title="بالا" onClick={(e) => { e.stopPropagation(); a.moveBlockById(block.id, "up"); }}>
            <ChevronUp className="h-3 w-3" />
          </button>
          <button type="button" className={iconBtn} disabled={locked || index >= siblings - 1} title="پایین" onClick={(e) => { e.stopPropagation(); a.moveBlockById(block.id, "down"); }}>
            <ChevronDown className="h-3 w-3" />
          </button>
          <button type="button" className={iconBtn} title="تغییر نام" onClick={(e) => { e.stopPropagation(); setDraft(labelOf(block)); setEditing(true); }}>
            <Pencil className="h-3 w-3" />
          </button>
          <button type="button" className={iconBtn} title="تکرار" onClick={(e) => { e.stopPropagation(); a.duplicateBlock(block.id); }}>
            <Copy className="h-3 w-3" />
          </button>
          <button type="button" className={iconBtn} title={disabled ? "فعال‌سازی" : "غیرفعال‌سازی"} onClick={(e) => { e.stopPropagation(); a.toggleBlockEnabled(block.id); }}>
            {disabled ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </button>
          <button type="button" className={iconBtn} title={locked ? "باز کردن قفل" : "قفل"} onClick={(e) => { e.stopPropagation(); a.setBlockLocked(block.id, !locked); }}>
            {locked ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
          </button>
          <button type="button" className={cn(iconBtn, "text-red-500")} disabled={locked} title="حذف" onClick={(e) => { e.stopPropagation(); void confirmAndRemove(block.id); }}>
            <Trash2 className="h-3 w-3" />
          </button>
        </span>
      </div>
      {tree.getChildren(block).length > 0 && (
        <ul className="space-y-0.5 mt-0.5">
          {tree.getChildren(block).map((c, i, arr) => (
            <Row key={c.id} block={c} depth={depth + 1} index={i} siblings={arr.length} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function NavigatorPanel() {
  const blocks = useBuilderStore((s) => s.blocks);

  if (!blocks.length) {
    return (
      <div className="p-4 text-center text-xs text-muted-foreground">
        <Layers className="h-6 w-6 mx-auto mb-2 opacity-40" />
        لایه‌ای وجود ندارد
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h2 className="text-xs font-bold text-muted-foreground">ناوبر لایه‌ها</h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">برای جابه‌جایی بکشید · دوبار کلیک برای تغییر نام</p>
      </div>
      <ul className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {blocks.map((block, index) => (
          <Row key={block.id} block={block} depth={0} index={index} siblings={blocks.length} />
        ))}
      </ul>
    </div>
  );
}
