"use client";

import { useEffect, useRef, useState } from "react";
import { useBuilderStore } from "@/builder/store/builder-store";
import type { PageBlock } from "@/builder/types";
import CanvasBlock from "./CanvasBlock";
import { cn } from "@/lib/utils";
import { LayoutTemplate } from "lucide-react";
import { VIEWPORTS } from "@/builder/responsive/types";
import { DeviceProvider } from "@/builder/responsive/device-context";

/**
 * Canvas scrolls the full page content (header → footer).
 * Width is device-aware; height follows content (no artificial 100vh clip).
 */
export default function BuilderCanvas() {
  const blocks = useBuilderStore((s) => s.blocks);
  const previewDevice = useBuilderStore((s) => s.previewDevice);
  const isPreview = useBuilderStore((s) => s.isPreview);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const clearSelection = useBuilderStore((s) => s.clearSelection);
  const dragFrom = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(600);

  const vp = VIEWPORTS[previewDevice] || VIEWPORTS.desktop;
  const isDesktop = previewDevice === "desktop";
  const isMobile = previewDevice === "mobile";
  const frameWidth = isDesktop ? Math.min(vp.width, 1200) : vp.width;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - 40;
      if (available <= 0) return;
      setScale(Math.min(1, available / frameWidth));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [frameWidth, previewDevice]);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const update = () => setContentHeight(Math.max(el.scrollHeight, 400));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [blocks, previewDevice, isPreview]);

  const renderBlocks = () => {
    if (!blocks.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] px-6 py-16 text-center bg-white">
          <div className="h-14 w-14 rounded-2xl bg-[#F0F5F9] flex items-center justify-center mb-4">
            <LayoutTemplate className="h-6 w-6 text-[#7C8FAC]" />
          </div>
          <p className="text-sm font-semibold text-[#2A3547]">بوم خالی است</p>
          <p className="text-xs text-[#7C8FAC] mt-1.5 max-w-[16rem] leading-relaxed">
            هدر، هیرو، فرم تماس، محصولات و فوتر را از پنل بلوک‌ها اضافه کنید.
          </p>
        </div>
      );
    }

    return (
      <div className="w-full bg-white text-foreground" data-builder-canvas-page dir="rtl">
        {blocks.map((block: PageBlock, index: number) => (
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
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden"
      style={{ background: "#E8ECF1" }}
      onClick={() => !isPreview && clearSelection()}
    >
      <div className="py-4 sm:py-6 px-3 sm:px-4 flex flex-col items-center">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 rounded-full bg-white border border-[#E5EAEF] px-3 py-1.5 shadow-sm">
          <span className="text-[11px] font-semibold text-[#2A3547]">{vp.labelFa}</span>
          <span className="text-[10px] text-[#7C8FAC] tabular-nums">{frameWidth}px</span>
          {scale < 0.99 && (
            <span className="text-[10px] text-[#5D87FF] font-medium tabular-nums">
              {Math.round(scale * 100)}%
            </span>
          )}
          <span className="text-[10px] text-[#7C8FAC] tabular-nums">{blocks.length} بلوک</span>
        </div>

        <div
          className="relative"
          style={{
            width: frameWidth * scale,
            height: contentHeight * scale,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={pageRef}
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: frameWidth,
              transform: `scale(${scale})`,
            }}
          >
            <DeviceProvider device={previewDevice}>
              <div
                className={cn(
                  "bg-white w-full border border-[#E5EAEF] overflow-x-hidden",
                  isDesktop
                    ? "rounded-xl shadow-sm"
                    : isMobile
                      ? "rounded-[1.5rem]"
                      : "rounded-[1.15rem]"
                )}
                style={
                  !isDesktop
                    ? {
                        boxShadow:
                          "0 0 0 3px #1e293b, 0 0 0 4px rgba(255,255,255,0.08), 0 20px 40px rgba(15,23,42,0.18)",
                      }
                    : undefined
                }
                data-builder-device={previewDevice}
              >
                {isMobile && (
                  <div className="flex justify-center pt-2 pb-1 pointer-events-none" aria-hidden>
                    <div className="h-1.5 w-16 rounded-full bg-[#1e293b]/80" />
                  </div>
                )}
                {renderBlocks()}
              </div>
            </DeviceProvider>
          </div>
        </div>

        <p className="mt-4 mb-2 text-[10px] text-[#7C8FAC] text-center max-w-sm leading-relaxed">
          اسکرول کامل صفحه · عرض واقعی {frameWidth}px
        </p>
      </div>
    </div>
  );
}
