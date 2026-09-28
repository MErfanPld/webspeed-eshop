"use client";

import { useEffect, useRef, useState } from "react";
import { useBuilderStore } from "@/builder/store/builder-store";
import type { PageBlock } from "@/builder/types";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const vp = VIEWPORTS[previewDevice] || VIEWPORTS.desktop;
  const isDesktop = previewDevice === "desktop";
  const isMobile = previewDevice === "mobile";
  const targetWidth = isDesktop ? null : vp.width;

  useEffect(() => {
    if (isDesktop || !targetWidth) {
      setScale(1);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const available = el.clientWidth - 32;
      if (available <= 0) return;
      const next = Math.min(1, available / targetWidth);
      setScale(next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isDesktop, targetWidth, previewDevice]);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-auto"
      style={{ background: "#E8ECF1" }}
      onClick={() => !isPreview && clearSelection()}
    >
      <div className="min-h-full p-3 sm:p-4 md:p-6 flex flex-col items-center">
        <div className="mb-3 flex items-center gap-2 rounded-full bg-white border border-[#E5EAEF] px-3 py-1.5 shadow-sm">
          <span className="text-[11px] font-semibold text-[#2A3547]">{vp.labelFa}</span>
          <span className="text-[10px] text-[#7C8FAC] tabular-nums">
            {vp.width} × {vp.height}
          </span>
          {!isDesktop && scale < 0.99 && (
            <span className="text-[10px] text-[#5D87FF] font-medium tabular-nums">
              {Math.round(scale * 100)}%
            </span>
          )}
        </div>

        {isDesktop ? (
          <div
            className="w-full max-w-[1100px] bg-white rounded-xl border border-[#E5EAEF] shadow-sm overflow-x-hidden min-h-[min(70vh,720px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <CanvasContent blocks={blocks} dragFrom={dragFrom} moveBlock={moveBlock} />
          </div>
        ) : (
          <div
            className="relative"
            style={{
              width: targetWidth! * scale,
              height: Math.min(vp.height, 820) * scale,
            }}
          >
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{
                width: targetWidth!,
                transform: `scale(${scale})`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={cn(
                  "bg-white overflow-hidden relative",
                  isMobile ? "rounded-[1.6rem]" : "rounded-[1.25rem]"
                )}
                style={{
                  width: targetWidth!,
                  height: Math.min(vp.height, 820),
                  boxShadow:
                    "0 0 0 3px #1e293b, 0 0 0 4px rgba(255,255,255,0.08), 0 24px 48px rgba(15,23,42,0.2)",
                }}
              >
                {isMobile && (
                  <div
                    className="absolute top-2 left-1/2 z-20 h-1.5 w-20 -translate-x-1/2 rounded-full bg-[#1e293b]/85"
                    aria-hidden
                  />
                )}
                <div className="h-full overflow-y-auto overflow-x-hidden">
                  <CanvasContent blocks={blocks} dragFrom={dragFrom} moveBlock={moveBlock} />
                </div>
              </div>
            </div>
          </div>
        )}

        {!isDesktop && (
          <p className="mt-3 text-[10px] text-[#7C8FAC] text-center max-w-xs leading-relaxed">
            پیش‌نمایش {vp.labelFa} — در صورت کمبود فضا خودکار کوچک می‌شود
          </p>
        )}
      </div>
    </div>
  );
}

function CanvasContent({
  blocks,
  dragFrom,
  moveBlock,
}: {
  blocks: PageBlock[];
  dragFrom: React.MutableRefObject<number | null>;
  moveBlock: (from: number, to: number) => void;
}) {
  if (!blocks.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[48vh] px-6 py-12 text-center">
        <div className="h-14 w-14 rounded-2xl bg-[#F0F5F9] flex items-center justify-center mb-4">
          <LayoutTemplate className="h-6 w-6 text-[#7C8FAC]" />
        </div>
        <p className="text-sm font-semibold text-[#2A3547]">بوم خالی است</p>
        <p className="text-xs text-[#7C8FAC] mt-1.5 max-w-[16rem] leading-relaxed">
          از پنل بلوک‌ها، سکشن موردنظر را اضافه کنید.
        </p>
      </div>
    );
  }

  return (
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
            dragFrom.current = null;
            if (from == null || from === to) return;
            moveBlock(from, to);
          }}
          onDragOver={() => {}}
        />
      ))}
    </div>
  );
}
