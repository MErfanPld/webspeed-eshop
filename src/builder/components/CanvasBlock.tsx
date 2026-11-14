"use client";

import { BlockRenderer } from "@/builder/BlockRenderer";
import BlockErrorBoundary from "@/builder/components/BlockErrorBoundary";
import type { PageBlock } from "@/builder/types";
import { isLocked, useBuilderStore } from "@/builder/store/builder-store";
import { cn } from "@/lib/utils";
import { Copy, Trash2, ChevronUp, ChevronDown, GripVertical, Lock, LockOpen, EyeOff } from "lucide-react";
import { getBlockDefinition } from "@/builder/registry/block-registry";
import {
  cancelDrag,
  commitDrop,
  computeDropTarget,
  computeZoneTarget,
  getDrag,
  startDrag,
} from "@/builder/dnd/drag-state";
import { confirmAndRemove } from "@/builder/hooks/shortcuts";

type Props = {
  block: PageBlock;
  index: number;
  siblingsCount: number;
};

function labelOf(block: PageBlock): string {
  const data = (block as { data?: Record<string, unknown> }).data || {};
  return String(data._label || getBlockDefinition(block.type)?.nameFa || block.type);
}

/** Visible drop line / outline for the active drop target */
function DropIndicator({ position }: { position: "before" | "after" | "inside" }) {
  if (position === "inside") {
    return (
      <div className="pointer-events-none absolute inset-0 z-30 rounded-sm border-2 border-dashed border-[#5D87FF] bg-[#5D87FF]/5" />
    );
  }
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-30 h-1 rounded-full bg-[#5D87FF] shadow-[0_0_0_2px_rgba(93,135,255,0.25)]",
        position === "before" ? "-top-0.5" : "-bottom-0.5"
      )}
    />
  );
}

/** Drop zone shown inside an empty container or an empty canvas */
export function EmptyDropZone({ parentId, label }: { parentId: string | null; label: string }) {
  const blocks = useBuilderStore((s) => s.blocks);
  const dropTarget = useBuilderStore((s) => s.dropTarget);
  const setDropTarget = useBuilderStore((s) => s.setDropTarget);
  const active = dropTarget?.position === "inside" && dropTarget.anchorId === parentId && dropTarget.parentId === parentId;
  return (
    <div
      className={cn(
        "m-2 flex min-h-[72px] items-center justify-center rounded-lg border-2 border-dashed px-3 text-center text-[11px] transition-colors",
        active ? "border-[#5D87FF] bg-[#5D87FF]/5 text-[#5D87FF]" : "border-[#CBD5E1] text-[#94A3B8]"
      )}
      onDragOver={(e) => {
        if (!getDrag()) return;
        e.preventDefault();
        e.stopPropagation();
        setDropTarget(computeZoneTarget(blocks, parentId));
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        commitDrop();
      }}
    >
      {label}
    </div>
  );
}

/**
 * Wraps a real storefront BlockRenderer with builder chrome
 * (select, drag & drop, toolbar). Never replaces the block component.
 */
export default function CanvasBlock({ block, index, siblingsCount }: Props) {
  const selected = useBuilderStore((s) => s.selectedBlockId === block.id);
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock);
  const moveBlockById = useBuilderStore((s) => s.moveBlockById);
  const setBlockLocked = useBuilderStore((s) => s.setBlockLocked);
  const setDropTarget = useBuilderStore((s) => s.setDropTarget);
  const blocks = useBuilderStore((s) => s.blocks);
  const indicator = useBuilderStore((s) =>
    s.dropTarget && s.dropTarget.anchorId === block.id ? s.dropTarget.position : null
  );

  const locked = isLocked(block);
  const data = (block as { data?: Record<string, unknown> }).data || {};
  const vis = (data._visibility as Record<string, boolean> | undefined) || {};
  const hiddenSomewhere = vis.desktop === false || vis.tablet === false || vis.mobile === false;

  const btn = "h-7 w-7 flex items-center justify-center hover:bg-[#F0F5F9] disabled:opacity-30";

  return (
    <div
      className="relative group/ws"
      data-block-id={block.id}
      data-block-type={block.type}
      draggable={!locked}
      onDragStart={(e) => {
        e.stopPropagation();
        startDrag(e, { kind: "move", id: block.id, type: block.type });
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        cancelDrag();
      }}
      onDragOver={(e) => {
        if (!getDrag()) return;
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setDropTarget(computeDropTarget(blocks, block.id, rect, e.clientY));
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        commitDrop();
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
    >
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-10 rounded-sm transition-shadow",
          selected
            ? "ring-2 ring-[#111] ring-inset"
            : "group-hover/ws:ring-1 group-hover/ws:ring-inset group-hover/ws:ring-[#111]/30"
        )}
      />
      {indicator && <DropIndicator position={indicator} />}

      {(selected || locked || hiddenSomewhere || block.enabled === false) && (
        <div className="absolute top-1 right-1 z-20 flex items-center gap-1" dir="rtl">
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-md shadow-sm inline-flex items-center gap-1",
              selected ? "bg-[#111] text-white" : "bg-white/90 text-[#2A3547] border border-[#E5EAEF]"
            )}
          >
            {locked && <Lock className="h-3 w-3" />}
            {(hiddenSomewhere || block.enabled === false) && <EyeOff className="h-3 w-3" />}
            {labelOf(block)}
          </span>
          {selected && (
            <div className="flex items-center bg-white border border-[#E5EAEF] shadow-sm rounded-md overflow-hidden">
              {!locked && (
                <span className="h-7 w-7 flex items-center justify-center cursor-grab active:cursor-grabbing text-[#7C8FAC]" title="بکشید برای جابه‌جایی">
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
              )}
              <button type="button" className={btn} disabled={locked || index === 0} onClick={(e) => { e.stopPropagation(); moveBlockById(block.id, "up"); }} aria-label="بالا" title="بالا (Alt+↑)">
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" className={btn} disabled={locked || index >= siblingsCount - 1} onClick={(e) => { e.stopPropagation(); moveBlockById(block.id, "down"); }} aria-label="پایین" title="پایین (Alt+↓)">
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" className={btn} onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }} aria-label="تکرار" title="تکرار (Ctrl+D)">
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button type="button" className={btn} onClick={(e) => { e.stopPropagation(); setBlockLocked(block.id, !locked); }} aria-label={locked ? "باز کردن قفل" : "قفل"} title={locked ? "باز کردن قفل" : "قفل کردن"}>
                {locked ? <LockOpen className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              </button>
              <button type="button" className={cn(btn, "text-red-600 hover:bg-red-50")} disabled={locked} onClick={(e) => { e.stopPropagation(); void confirmAndRemove(block.id); }} aria-label="حذف" title="حذف (Delete)">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      <BlockErrorBoundary blockId={block.id} blockType={block.type} onRemove={() => void confirmAndRemove(block.id)}>
        <BlockRenderer block={block} showDisabled />
      </BlockErrorBoundary>
    </div>
  );
}
