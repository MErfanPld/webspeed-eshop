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
      className={cn("relative group", selected && "z-10")}
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
          "absolute inset-0 pointer-events-none z-10 transition-all",
          selected
            ? "ring-2 ring-primary ring-offset-1"
            : "group-hover:ring-1 group-hover:ring-primary/40"
        )}
      />

      {selected && (
        <div className="absolute top-0 right-0 z-20 flex items-center gap-0.5 -translate-y-full pb-1">
          <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-t-md">
            {def?.nameFa || block.type}
          </span>
          <div className="flex items-center bg-white border border-border shadow-sm rounded-t-md overflow-hidden">
            <span
              className="h-7 w-7 flex items-center justify-center cursor-grab active:cursor-grabbing"
              title="جابجایی"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </span>
            <button
              type="button"
              className="h-7 w-7 flex items-center justify-center hover:bg-muted disabled:opacity-30"
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
              className="h-7 w-7 flex items-center justify-center hover:bg-muted disabled:opacity-30"
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
              className="h-7 w-7 flex items-center justify-center hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                duplicateBlock(block.id);
              }}
              aria-label="کپی"
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

      <div className="pointer-events-none select-none">
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
