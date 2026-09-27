"use client";

import { useRef } from "react";
import { useBuilderStore } from "@/builder/store/builder-store";
import CanvasBlock from "./CanvasBlock";
import { cn } from "@/lib/utils";
import { LayoutTemplate } from "lucide-react";

const WIDTHS = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
} as const;

export default function BuilderCanvas() {
  const blocks = useBuilderStore((s) => s.blocks);
  const previewDevice = useBuilderStore((s) => s.previewDevice);
  const isPreview = useBuilderStore((s) => s.isPreview);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const clearSelection = useBuilderStore((s) => s.clearSelection);
  const dragFrom = useRef<number | null>(null);

  return (
    <div
      className="flex-1 overflow-auto bg-[#e8e8e8] p-4 sm:p-6"
      onClick={() => !isPreview && clearSelection()}
    >
      <div
        className={cn(
          "mx-auto bg-white shadow-sm min-h-[60vh] transition-all duration-300",
          previewDevice !== "desktop" && "border border-border"
        )}
        style={{
          width: WIDTHS[previewDevice],
          maxWidth: "100%",
        }}
      >
        {!blocks.length ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
            <LayoutTemplate className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-semibold">بوم خالی است</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
              از پنل سمت راست یک بلوک اضافه کنید تا صفحه ساخته شود.
            </p>
          </div>
        ) : (
          <div>
            {blocks.map((block, index) => (
              <CanvasBlock
                key={block.id}
                block={block}
                index={index}
                onDragStart={(i) => {
                  dragFrom.current = i;
                }}
                onDrop={(to) => {
                  const from = dragFrom.current;
                  if (from == null || from === to) return;
                  moveBlock(from, to);
                  dragFrom.current = null;
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
