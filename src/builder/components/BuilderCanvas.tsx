"use client";

import { useRef } from "react";
import { useBuilderStore } from "@/builder/store/builder-store";
import CanvasBlock from "./CanvasBlock";
import { cn } from "@/lib/utils";
import { LayoutTemplate } from "lucide-react";
import { VIEWPORTS } from "@/builder/responsive/types";

export default function BuilderCanvas() {
  const blocks = useBuilderStore((s) => s.blocks);
  const previewDevice = useBuilderStore((s) => s.previewDevice);
  const isPreview = useBuilderStore((s) => s.isPreview);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const clearSelection = useBuilderStore((s) => s.clearSelection);
  const dragFrom = useRef<number | null>(null);

  const vp = VIEWPORTS[previewDevice] || VIEWPORTS.desktop;
  const frameWidth = previewDevice === "desktop" ? "100%" : `${vp.width}px`;

  return (
    <div
      className="flex-1 overflow-auto bg-[#e5e7eb] p-2 sm:p-4 md:p-6"
      onClick={() => !isPreview && clearSelection()}
    >
      <div className="mx-auto mb-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <span className="font-medium">{vp.labelFa}</span>
        <span className="tabular-nums">
          {vp.width}×{vp.height}
        </span>
      </div>

      <div
        className={cn(
          "mx-auto bg-white min-h-[60vh] transition-all duration-300 overflow-x-hidden",
          previewDevice !== "desktop" &&
            "shadow-lg border border-border rounded-xl"
        )}
        style={{
          width: frameWidth,
          maxWidth: "100%",
          minHeight:
            previewDevice === "desktop" ? "60vh" : Math.min(vp.height, 800),
        }}
      >
        {!blocks.length ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center">
            <LayoutTemplate className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-semibold">بوم خالی است</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
              از کتابخانه بلوک‌ها، سکشن، هدر، محصولات یا فوتر اضافه کنید.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-hidden">
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
