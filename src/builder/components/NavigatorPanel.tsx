"use client";

import { useBuilderStore } from "@/builder/store/builder-store";
import { getBlockDefinition } from "@/builder/registry/block-registry";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
} from "lucide-react";

export default function NavigatorPanel() {
  const blocks = useBuilderStore((s) => s.blocks);
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const removeBlock = useBuilderStore((s) => s.removeBlock);
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock);
  const moveBlockById = useBuilderStore((s) => s.moveBlockById);
  const updateBlockData = useBuilderStore((s) => s.updateBlockData);

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
      </div>
      <ul className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {blocks.map((block, index) => {
          const def = getBlockDefinition(block.type);
          const selected = selectedBlockId === block.id;
          const data = (block as { data?: Record<string, unknown> }).data || {};
          const vis = (data._visibility as { mobile?: boolean }) || {};
          const hiddenMobile = vis.mobile === false;

          return (
            <li key={block.id}>
              <div
                className={cn(
                  "group flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs cursor-pointer",
                  selected
                    ? "bg-foreground text-background"
                    : "hover:bg-muted text-foreground"
                )}
                onClick={() => selectBlock(block.id)}
              >
                <span className="truncate flex-1 font-medium">
                  {def?.nameFa || block.type}
                </span>
                <span className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                  <button type="button" className="h-6 w-6 inline-flex items-center justify-center rounded" onClick={(e) => { e.stopPropagation(); moveBlockById(block.id, "up"); }}>
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button type="button" className="h-6 w-6 inline-flex items-center justify-center rounded" onClick={(e) => { e.stopPropagation(); moveBlockById(block.id, "down"); }}>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <button type="button" className="h-6 w-6 inline-flex items-center justify-center rounded" onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}>
                    <Copy className="h-3 w-3" />
                  </button>
                  <button type="button" className="h-6 w-6 inline-flex items-center justify-center rounded" onClick={(e) => { e.stopPropagation(); updateBlockData(block.id, "_visibility.mobile", !hiddenMobile); }}>
                    {hiddenMobile ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </button>
                  <button type="button" className="h-6 w-6 inline-flex items-center justify-center rounded text-red-500" onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}>
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
                <span className="text-[10px] opacity-50 tabular-nums w-4 text-left">{index + 1}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
