"use client";

import { BlockRenderer } from "@/builder/BlockRenderer";
import BlockErrorBoundary from "@/builder/components/BlockErrorBoundary";
import type { PageBlock } from "@/builder/types";
import { useBuilderStore } from "@/builder/store/builder-store";
import { cn } from "@/lib/utils";
import {
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { getBlockDefinition } from "@/builder/registry/block-registry";

type Props = {
  block: PageBlock;
  index: number;
  onDragStart?: (index: number) => void;
  onDragOver?: (index: number) => void;
  onDrop?: (index: number) => void;
};

/**
 * Wraps a real storefront BlockRenderer with builder chrome (select, drag, label).
 * Does NOT replace the block component — only overlays controls.
 */
export default function CanvasBlock({
  block,
  index,
  onDragStart,
  onDragOver,
  onDrop,
}: Props) {
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const removeBlock = useBuilderStore((s) => s.removeBlock);
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock);
  const moveBlockById = useBuilderStore((s) => s.moveBlockById);
  const isPreview = useBuilderStore((s) => s.isPreview);
  const blocksLen = useBuilderStore((s) => s.blocks.length);

  const selected = selectedBlockId === block.id;
  const def = getBlockDefinition(block.type);

  if (isPreview) {
    return (
      <BlockErrorBoundary blockId={block.id} blockType={block.type}>
        <BlockRenderer block={block} />
      </BlockErrorBoundary>
    );
  }

  return (
    <div
      className={cn(
        "relative group",
        selected && "z-10",
        block.enabled === false && "opacity-40"
      )}
      data-block-id={block.id}
      data-block-type={block.type}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(index);
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
    >
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-10 transition-all rounded-sm",
          selected
            ? "ring-2 ring-[#111] ring-offset-2"
            : "group-hover:ring-1 group-hover:ring-[#111]/30"
        )}
      />

      {selected && (
        <div className="absolute top-0 right-0 z-20 flex items-center gap-0.5 -translate-y-full pb-1">
          <span className="bg-[#111] text-white text-[10px] font-bold px-2.5 py-1 rounded-t-md shadow-sm">
            {def?.nameFa || block.type}
          </span>
          <div className="flex items-center bg-white border border-[#E5EAEF] shadow-sm rounded-t-md overflow-hidden">
            <span
              className="h-7 w-7 flex items-center justify-center cursor-grab active:cursor-grabbing text-[#7C8FAC]"
              title="جابجایی"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </span>
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center hover:bg-[#F0F5F9] disabled:opacity-30"
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                moveBlockById(block.id, "up");
              }}
              aria-label="بالا"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center hover:bg-[#F0F5F9] disabled:opacity-30"
              disabled={index >= blocksLen - 1}
              onClick={(e) => {
                e.stopPropagation();
                moveBlockById(block.id, "down");
              }}
              aria-label="پایین"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center hover:bg-[#F0F5F9]"
              onClick={(e) => {
                e.stopPropagation();
                duplicateBlock(block.id);
              }}
              aria-label="تکرار"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center hover:bg-red-50 text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                removeBlock(block.id);
              }}
              aria-label="حذف"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <div
        className="relative z-0"
        onClick={(e) => {
          const t = e.target as HTMLElement;
          if (t.closest("a, button")) {
            e.preventDefault();
          }
        }}
      >
        <BlockErrorBoundary
          blockId={block.id}
          blockType={block.type}
          onRemove={() => removeBlock(block.id)}
        >
          <BlockRenderer block={block} />
        </BlockErrorBoundary>
      </div>
    </div>
  );
}
