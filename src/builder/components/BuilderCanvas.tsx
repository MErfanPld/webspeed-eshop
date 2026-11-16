"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useBuilderStore } from "@/builder/store/builder-store";
import type { PageBlock } from "@/builder/types";
import CanvasBlock, { EmptyDropZone } from "./CanvasBlock";
import CanvasFrame from "./CanvasFrame";
import { cn } from "@/lib/utils";
import { VIEWPORTS, type DeviceKey } from "@/builder/responsive/types";
import { ChildrenRendererProvider } from "@/builder/rendering/BlockChildren";
import { PageRenderer } from "@/builder/rendering/PageRenderer";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";
import { useSiteLayout } from "@/builder/hooks/useSiteLayout";
import { isLayoutPageType } from "@/builder/contracts/page-contract";
import { cancelDrag } from "@/builder/dnd/drag-state";
import { api } from "@/lib/api/client";
import { normalizeTheme, themeCss } from "@/lib/theme/theme";

/** Children of container blocks get builder chrome too */
function renderEditableChildren(parent: PageBlock, kids: PageBlock[]) {
  if (!kids.length) {
    return <EmptyDropZone parentId={parent.id} label="بلوک را اینجا رها کنید" />;
  }
  return kids.map((c, i) => <CanvasBlock key={c.id} block={c} index={i} siblingsCount={kids.length} />);
}

/** Non-interactive global header/footer so the preview matches the storefront */
function ChromePreview({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative" aria-hidden>
      <div className="flex items-center justify-center gap-1 bg-[#F1F5F9] py-0.5 text-[9px] font-semibold text-[#64748B] border-y border-dashed border-[#CBD5E1]">
        {label} · فقط نمایش (از «صفحات» قابل ویرایش است)
      </div>
      <div className="pointer-events-none select-none">{children}</div>
    </div>
  );
}

type Props = {
  onFrameDocument?: (doc: Document | null) => void;
};

/**
 * Device preview canvas (iframe based).
 * - The frame has the REAL device width (1280 / 768 / 390), so media
 *   queries and Tailwind breakpoints behave as on a real device.
 * - Scale only shrinks the frame visually to fit the panel.
 */
export default function BuilderCanvas({ onFrameDocument }: Props) {
  const blocks = useBuilderStore((s) => s.blocks);
  const previewDevice = useBuilderStore((s) => s.previewDevice);
  const isPreview = useBuilderStore((s) => s.isPreview);
  const clearSelection = useBuilderStore((s) => s.clearSelection);
  const showSiteChrome = useBuilderStore((s) => s.showSiteChrome);
  const pageType = useBuilderStore((s) => s.page?.type);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(600);

  const vp = VIEWPORTS[previewDevice as DeviceKey] || VIEWPORTS.desktop;
  const isDesktop = previewDevice === "desktop";
  const frameWidth = isDesktop ? Math.min(vp.width, 1280) : vp.width;

  const isLayoutDoc = pageType ? isLayoutPageType(pageType) : false;

  // Preview with the store's theme (same CSS variables as the storefront)
  const [themeStyle, setThemeStyle] = useState("");
  useEffect(() => {
    let cancelled = false;
    api<{ store: { settings: { theme?: unknown } } }>("/admin/store")
      .then((r) => !cancelled && setThemeStyle(themeCss(normalizeTheme(r.store.settings.theme))))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  const chrome = useSiteLayout(showSiteChrome && !isLayoutDoc);

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
    scrollRef.current?.scrollTo({ top: 0 });
  }, [previewDevice]);

  const pad = isDesktop ? 32 : 48;
  const scale = panelWidth > 0 ? Math.min(1, Math.max(0.2, (panelWidth - pad) / frameWidth)) : 1;
  const height = Math.max(contentHeight, 320);

  const onHeight = useCallback((h: number) => setContentHeight(h), []);

  const page = (
    <div
      className="w-full min-h-[320px] bg-white text-foreground"
      dir="rtl"
      data-builder-canvas-page
      // Builder UI inside the zoomed frame is counter-scaled to stay readable
      style={{ ["--ws-ui" as string]: String(Math.min(2.2, 1 / scale)) }}
      // Never navigate away or submit forms from inside the canvas
      onClickCapture={(e) => {
        const t = e.target as HTMLElement;
        if (t.closest("a")) e.preventDefault();
      }}
      onSubmitCapture={(e) => e.preventDefault()}
      onClick={() => !isPreview && clearSelection()}
      onDragEnd={() => cancelDrag()}
    >
      {themeStyle && <style dangerouslySetInnerHTML={{ __html: themeStyle }} />}
      {showSiteChrome && !isLayoutDoc && (
        <ChromePreview label={chrome.header ? "هدر سراسری" : "هدر پیش‌فرض"}>
          <SiteHeader blocks={chrome.header} />
        </ChromePreview>
      )}

      {isPreview ? (
        <PageRenderer blocks={blocks} />
      ) : blocks.length ? (
        <ChildrenRendererProvider value={renderEditableChildren}>
          {blocks.map((block, index) => (
            <CanvasBlock key={block.id} block={block} index={index} siblingsCount={blocks.length} />
          ))}
          <EmptyDropZone parentId={null} label="برای افزودن به انتهای صفحه، بلوک را اینجا رها کنید" />
        </ChildrenRendererProvider>
      ) : (
        <div className="px-6 py-16">
          <EmptyDropZone parentId={null} label="بوم خالی است — از پنل بلوک‌ها یک بلوک را بکشید یا روی آن کلیک کنید." />
        </div>
      )}

      {showSiteChrome && !isLayoutDoc && (
        <ChromePreview label={chrome.footer ? "فوتر سراسری" : "فوتر پیش‌فرض"}>
          <SiteFooter blocks={chrome.footer} />
        </ChromePreview>
      )}
    </div>
  );

  return (
    <div
      ref={scrollRef}
      className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden"
      // Reserve the scrollbar space: a scrollbar appearing/disappearing would change
      // the zoom, which changes the height, which toggles the scrollbar again (jitter)
      style={{ background: "#E8ECF1", scrollbarGutter: "stable" }}
      onClick={() => !isPreview && clearSelection()}
      onDragEnd={() => cancelDrag()}
      data-preview-device={previewDevice}
    >
      <div className="flex flex-col items-center w-full" style={{ padding: "16px 16px 32px", minHeight: "100%" }}>
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2 rounded-full bg-white border border-[#E5EAEF] px-3 py-1.5 shadow-sm shrink-0">
          <span className="text-[11px] font-semibold text-[#2A3547]">{vp.labelFa}</span>
          <span className="text-[10px] text-[#7C8FAC] tabular-nums" dir="ltr">
            {frameWidth}px
          </span>
          {scale < 0.995 && (
            <span className="text-[10px] text-[#5D87FF] font-medium tabular-nums">{Math.round(scale * 100)}%</span>
          )}
          <span className="text-[10px] text-[#7C8FAC] tabular-nums">{blocks.length} بلوک</span>
        </div>

        <div className="relative shrink-0" style={{ width: frameWidth * scale, height: height * scale }} onClick={(e) => e.stopPropagation()}>
          <div
            className={cn(
              "absolute top-0 overflow-hidden bg-white",
              isDesktop ? "rounded-xl border border-[#E5EAEF] shadow-sm" : previewDevice === "tablet" ? "rounded-[1.25rem]" : "rounded-[1.75rem]"
            )}
            style={{
              width: frameWidth,
              height,
              left: "50%",
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: "top center",
              boxShadow: isDesktop ? undefined : "0 0 0 3px #1e293b, 0 18px 40px rgba(15,23,42,0.2)",
            }}
            data-builder-device={previewDevice}
          >
            <CanvasFrame width={frameWidth} editMode={!isPreview} onHeightChange={onHeight} onDocument={onFrameDocument}>
              {page}
            </CanvasFrame>
          </div>
        </div>

        <p className="mt-4 text-[10px] text-[#7C8FAC] text-center leading-relaxed shrink-0">
          پیش‌نمایش واقعی در عرض {frameWidth}px (iframe) — breakpointها مانند دستگاه واقعی عمل می‌کنند.
        </p>
      </div>
    </div>
  );
}
