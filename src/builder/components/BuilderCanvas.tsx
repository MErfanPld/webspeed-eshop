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
  const isDesktop = previewDevice === "desktop";
  const isMobile = previewDevice === "mobile";
  const frameWidth = isDesktop ? "100%" : `${vp.width}px`;

  return (
    <div
      className="flex-1 overflow-auto"
      style={{ background: "#E8ECF1" }}
      onClick={() => !isPreview && clearSelection()}
    >
      <div className="min-h-full p-3 sm:p-5 md:p-8 flex flex-col items-center">
        <div className="mb-3 flex items-center gap-2 rounded-full bg-white/90 border border-[#E5EAEF] px-3 py-1.5 shadow-sm">
          <span className="text-[11px] font-semibold text-[#2A3547]">{vp.labelFa}</span>
          <span className="text-[10px] text-[#7C8FAC] tabular-nums">
            {vp.width} × {vp.height}
          </span>
        </div>

        <div
          className={cn("relative transition-all duration-300 ease-out", !isDesktop && "mx-auto")}
          style={{ width: frameWidth, maxWidth: "100%" }}
        >
          {!isDesktop && (
            <div
              className="pointer-events-none absolute inset-0 z-20 rounded-[1.75rem] border-[3px] border-[#1e293b]/90"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.08), 0 20px 50px rgba(15,23,42,0.18)",
              }}
            />
          )}
          {!isDesktop && isMobile && (
            <div
              className="pointer-events-none absolute top-2 left-1/2 z-30 h-1.5 w-20 -translate-x-1/2 rounded-full bg-[#1e293b]/80"
              aria-hidden
            />
          )}

          <div
            className={cn(
              "bg-white overflow-x-hidden overflow-y-auto relative z-10",
              isDesktop
                ? "min-h-[min(70vh,800px)] rounded-xl border border-[#E5EAEF] shadow-sm"
                : isMobile
                  ? "rounded-[1.5rem] min-h-[560px] max-h-[min(780px,75vh)]"
                  : "rounded-[1.35rem] min-h-[640px] max-h-[min(900px,80vh)]"
            )}
            style={!isDesktop ? { width: "100%", isolation: "isolate" } : undefined}
          >
            <div className="w-full" style={!isDesktop ? { maxWidth: "100%", overflowX: "hidden" } : undefined}>
              {!blocks.length ? (
                <div className="flex flex-col items-center justify-center min-h-[48vh] px-6 py-12 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-[#F0F5F9] flex items-center justify-center mb-4">
                    <LayoutTemplate className="h-6 w-6 text-[#7C8FAC]" />
                  </div>
                  <p className="text-sm font-semibold text-[#2A3547]">بوم خالی است</p>
                  <p className="text-xs text-[#7C8FAC] mt-1.5 max-w-[16rem] leading-relaxed">
                    از کتابخانه سمت راست، بلوک اضافه کنید و صفحه را بچینید.
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
                        dragFrom.current = null;
                        if (from == null || from === to) return;
                        moveBlock(from, to);
                      }}
                      onDragOver={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {!isDesktop && (
          <p className="mt-3 text-[10px] text-[#7C8FAC] text-center max-w-xs leading-relaxed">
            پیش‌نمایش تقریبی {vp.labelFa} — عرض واقعی {vp.width}px
          </p>
        )}
      </div>
    </div>
  );
}
