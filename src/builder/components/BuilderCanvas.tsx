"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useBuilderStore } from "@/builder/store/builder-store";
import type { PageBlock } from "@/builder/types";
import CanvasBlock from "./CanvasBlock";
import { cn } from "@/lib/utils";
import { LayoutTemplate } from "lucide-react";
import { VIEWPORTS, type DeviceKey } from "@/builder/responsive/types";
import { DeviceProvider } from "@/builder/responsive/device-context";

/**
 * Device preview canvas.
 * - Frame has REAL device width (1440 / 768 / 390).
 * - Scale only shrinks the frame to fit the panel.
 * - transform-origin top center (RTL-safe).
 */
export default function BuilderCanvas() {
  const blocks = useBuilderStore((s) => s.blocks);
  const previewDevice = useBuilderStore((s) => s.previewDevice);
  const isPreview = useBuilderStore((s) => s.isPreview);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const clearSelection = useBuilderStore((s) => s.clearSelection);

  const dragFrom = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(480);
  const [panelWidth, setPanelWidth] = useState(0);

  const vp = VIEWPORTS[previewDevice as DeviceKey] || VIEWPORTS.desktop;
  const isDesktop = previewDevice === "desktop";
  const isMobile = previewDevice === "mobile";
  const isTablet = previewDevice === "tablet";
  const frameWidth = isDesktop ? Math.min(vp.width, 1280) : vp.width;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setPanelWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (panelWidth <= 0) return;
    const pad = isDesktop ? 32 : 48;
    const available = Math.max(200, panelWidth - pad);
    const next = Math.min(1, available / frameWidth);
    setScale(Number.isFinite(next) && next > 0 ? next : 1);
  }, [panelWidth, frameWidth, isDesktop, previewDevice]);

  const remeasure = useCallback(() => {
    const el = pageRef.current;
    if (!el) return;
    const h = Math.max(el.scrollHeight, el.offsetHeight, 320);
    setContentHeight(h);
  }, []);

  useLayoutEffect(() => {
    setContentHeight(480);
    const id = requestAnimationFrame(() => {
      remeasure();
      requestAnimationFrame(remeasure);
    });
    return () => cancelAnimationFrame(id);
  }, [blocks, previewDevice, isPreview, scale, remeasure]);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => remeasure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [remeasure, previewDevice]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [previewDevice]);

  const scaledW = frameWidth * scale;
  const scaledH = contentHeight * scale;

  const renderBlocks = () => {
    if (!blocks.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[360px] px-6 py-16 text-center bg-white">
          <div className="h-14 w-14 rounded-2xl bg-[#F0F5F9] flex items-center justify-center mb-4">
            <LayoutTemplate className="h-6 w-6 text-[#7C8FAC]" />
          </div>
          <p className="text-sm font-semibold text-[#2A3547]">بوم خالی است</p>
          <p className="text-xs text-[#7C8FAC] mt-1.5 max-w-[16rem] leading-relaxed">
            از پنل بلوک‌ها، هدر، محتوا و فوتر را اضافه کنید.
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
      ref={scrollRef}
      className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden"
      style={{ background: "#E8ECF1" }}
      onClick={() => !isPreview && clearSelection()}
      data-preview-device={previewDevice}
    >
      <div
        className="flex flex-col items-center w-full"
        style={{
          paddingTop: 16,
          paddingBottom: 32,
          paddingInline: 16,
          minHeight: "100%",
        }}
      >
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 rounded-full bg-white border border-[#E5EAEF] px-3 py-1.5 shadow-sm shrink-0">
          <span className="text-[11px] font-semibold text-[#2A3547]">{vp.labelFa}</span>
          <span className="text-[10px] text-[#7C8FAC] tabular-nums">
            {frameWidth}×{vp.height}
          </span>
          {scale < 0.995 && (
            <span className="text-[10px] text-[#5D87FF] font-medium tabular-nums">
              {Math.round(scale * 100)}%
            </span>
          )}
          <span className="text-[10px] text-[#7C8FAC] tabular-nums">{blocks.length} بلوک</span>
        </div>

        <div
          className="relative shrink-0"
          style={{
            width: scaledW,
            height: scaledH,
            maxWidth: "100%",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={pageRef}
            className="absolute top-0"
            style={{
              width: frameWidth,
              left: "50%",
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: "top center",
              willChange: "transform",
            }}
          >
            <DeviceProvider device={previewDevice as DeviceKey}>
              <div
                className={cn(
                  "bg-white w-full overflow-x-hidden",
                  isDesktop && "rounded-xl border border-[#E5EAEF] shadow-sm",
                  isTablet && "rounded-[1.25rem]",
                  isMobile && "rounded-[1.75rem]"
                )}
                style={
                  !isDesktop
                    ? {
                        boxShadow:
                          "0 0 0 3px #1e293b, 0 0 0 5px rgba(255,255,255,0.12), 0 18px 40px rgba(15,23,42,0.2)",
                      }
                    : undefined
                }
                data-builder-device={previewDevice}
              >
                {isMobile && (
                  <div className="flex justify-center pt-2.5 pb-1.5 pointer-events-none bg-white" aria-hidden>
                    <div className="h-1.5 w-20 rounded-full bg-[#1e293b]/85" />
                  </div>
                )}
                {isTablet && (
                  <div className="flex justify-center pt-2 pb-1 pointer-events-none bg-white" aria-hidden>
                    <div className="h-1 w-12 rounded-full bg-[#1e293b]/50" />
                  </div>
                )}

                <div
                  className={cn(
                    "builder-device-root w-full",
                    isMobile && "builder-device-mobile",
                    isTablet && "builder-device-tablet",
                    isDesktop && "builder-device-desktop"
                  )}
                >
                  {renderBlocks()}
                </div>
              </div>
            </DeviceProvider>
          </div>
        </div>

        <p className="mt-4 text-[10px] text-[#7C8FAC] text-center leading-relaxed shrink-0">
          {isDesktop
            ? "پیش‌نمایش دسکتاپ"
            : isTablet
              ? "پیش‌نمایش تبلت — عرض واقعی 768px"
              : "پیش‌نمایش موبایل — عرض واقعی 390px"}
        </p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        [data-builder-device="mobile"] .grid {
          grid-template-columns: 1fr !important;
        }
        [data-builder-device="mobile"] [class*="sm:grid-cols"],
        [data-builder-device="mobile"] [class*="md:grid-cols"],
        [data-builder-device="mobile"] [class*="lg:grid-cols"] {
          grid-template-columns: 1fr !important;
        }
        [data-builder-device="mobile"] .hidden.lg\\:flex {
          display: none !important;
        }
        [data-builder-device="tablet"] [class*="lg:grid-cols-4"] {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        [data-builder-device="mobile"] img {
          max-width: 100%;
          height: auto;
        }
        [data-builder-device="mobile"],
        [data-builder-device="tablet"] {
          overflow-x: hidden;
        }
      `,
        }}
      />
    </div>
  );
}
