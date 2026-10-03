"use client";

import { useEffect, useRef, useState } from "react";
import { useBuilderStore } from "@/builder/store/builder-store";
import BuilderToolbar from "./BuilderToolbar";
import BlockLibrary from "./BlockLibrary";
import BuilderCanvas from "./BuilderCanvas";
import PropertiesPanel from "./PropertiesPanel";
import NavigatorPanel from "./NavigatorPanel";
import { Layers, Settings2, X, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  pageId: string;
};

type MobilePanel = "none" | "library" | "props" | "layers";
type LayoutMode = "desktop" | "tablet" | "mobile";

function useLayoutMode(): LayoutMode {
  const [mode, setMode] = useState<LayoutMode>("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setMode("mobile");
      else if (w < 1100) setMode("tablet");
      else setMode("desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return mode;
}

export default function BuilderShell({ pageId }: Props) {
  const loadPage = useBuilderStore((s) => s.loadPage);
  const hydrated = useBuilderStore((s) => s.hydrated);
  const page = useBuilderStore((s) => s.page);
  const isPreview = useBuilderStore((s) => s.isPreview);
  const isDirty = useBuilderStore((s) => s.isDirty);
  const saveDraft = useBuilderStore((s) => s.saveDraft);
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const clearSelection = useBuilderStore((s) => s.clearSelection);
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);
  const removeBlock = useBuilderStore((s) => s.removeBlock);
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock);
  const copyBlock = useBuilderStore((s) => s.copyBlock);
  const pasteBlock = useBuilderStore((s) => s.pasteBlock);
  const copyStyle = useBuilderStore((s) => s.copyStyle);
  const pasteStyle = useBuilderStore((s) => s.pasteStyle);

  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("none");
  const [leftTab, setLeftTab] = useState<"blocks" | "layers">("blocks");
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layoutMode = useLayoutMode();

  const showSidebars = !isPreview && layoutMode !== "mobile";

  useEffect(() => {
    loadPage(pageId);
  }, [pageId, loadPage]);

  useEffect(() => {
    if (!isDirty) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveDraft();
    }, 1000);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [isDirty, saveDraft]);

  useEffect(() => {
    if (selectedBlockId && layoutMode === "mobile") {
      setMobilePanel("props");
    }
  }, [selectedBlockId, layoutMode]);

  useEffect(() => {
    const isTypingTarget = (t: EventTarget | null) =>
      t instanceof HTMLInputElement ||
      t instanceof HTMLTextAreaElement ||
      t instanceof HTMLSelectElement ||
      (t instanceof HTMLElement && t.isContentEditable);

    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveDraft();
      }
      if (mod && e.key.toLowerCase() === "c" && !e.shiftKey && !isTypingTarget(e.target)) {
        e.preventDefault();
        copyBlock();
      }
      if (mod && e.key.toLowerCase() === "v" && !e.shiftKey && !isTypingTarget(e.target)) {
        e.preventDefault();
        pasteBlock();
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === "c" && !isTypingTarget(e.target)) {
        e.preventDefault();
        copyStyle();
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === "v" && !isTypingTarget(e.target)) {
        e.preventDefault();
        pasteStyle();
      }
      if (mod && e.key.toLowerCase() === "d" && !isTypingTarget(e.target)) {
        e.preventDefault();
        if (selectedBlockId) duplicateBlock(selectedBlockId);
      }
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (mod && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (e.key === "Escape") {
        clearSelection();
        setMobilePanel("none");
      }
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedBlockId &&
        !isTypingTarget(e.target)
      ) {
        e.preventDefault();
        removeBlock(selectedBlockId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    saveDraft,
    undo,
    redo,
    clearSelection,
    selectedBlockId,
    removeBlock,
    duplicateBlock,
    copyBlock,
    pasteBlock,
    copyStyle,
    pasteStyle,
  ]);

  const gridColumns = isPreview
    ? "minmax(0, 1fr)"
    : layoutMode === "mobile"
      ? "minmax(0, 1fr)"
      : layoutMode === "tablet"
        ? "minmax(180px, 200px) minmax(0, 1fr) minmax(200px, 220px)"
        : "minmax(240px, 260px) minmax(0, 1fr) minmax(260px, 300px)";

  return (
    <div
      className="flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden"
      style={{
        fontFamily: "Vazirmatn, Tahoma, system-ui, sans-serif",
        background: "#E8ECF1",
      }}
      dir="rtl"
    >
      <BuilderToolbar
        onOpenLibrary={() =>
          setMobilePanel((p) => (p === "library" ? "none" : "library"))
        }
        onOpenProps={() =>
          setMobilePanel((p) => (p === "props" ? "none" : "props"))
        }
      />

      {!hydrated ? (
        <div className="flex-1 flex items-center justify-center text-sm text-[#7C8FAC] px-4">
          در حال بارگذاری...
        </div>
      ) : !page ? (
        <div className="flex-1 flex items-center justify-center text-sm text-[#7C8FAC] px-4 text-center">
          صفحه یافت نشد. از لیست صفحات یک صفحه بسازید یا انتخاب کنید.
        </div>
      ) : (
        <div
          className="flex-1 min-h-0 min-w-0"
          style={{
            display: "grid",
            gridTemplateColumns: gridColumns,
            gridTemplateRows: "minmax(0, 1fr)",
          }}
        >
          {showSidebars && (
            <aside
              className="min-h-0 min-w-0 flex flex-col bg-white border-l border-[#E5EAEF] overflow-hidden"
              aria-label="کتابخانه و لایه‌ها"
            >
              <div className="flex shrink-0 border-b border-[#E5EAEF]">
                <button
                  type="button"
                  onClick={() => setLeftTab("blocks")}
                  className={cn(
                    "flex-1 h-11 text-xs font-semibold transition-colors",
                    leftTab === "blocks"
                      ? "border-b-2 border-[#111] text-[#111]"
                      : "text-[#7C8FAC] hover:text-[#111]"
                  )}
                >
                  بلوک‌ها
                </button>
                <button
                  type="button"
                  onClick={() => setLeftTab("layers")}
                  className={cn(
                    "flex-1 h-11 text-xs font-semibold transition-colors",
                    leftTab === "layers"
                      ? "border-b-2 border-[#111] text-[#111]"
                      : "text-[#7C8FAC] hover:text-[#111]"
                  )}
                >
                  لایه‌ها
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                {leftTab === "blocks" ? <BlockLibrary /> : <NavigatorPanel />}
              </div>
            </aside>
          )}

          <div className="min-h-0 min-w-0 flex flex-col overflow-hidden">
            <BuilderCanvas />
          </div>

          {showSidebars && (
            <aside
              className="min-h-0 min-w-0 flex flex-col bg-white border-r border-[#E5EAEF] overflow-hidden"
              aria-label="ویژگی‌ها"
            >
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                <PropertiesPanel />
              </div>
            </aside>
          )}
        </div>
      )}

      {!isPreview && layoutMode === "mobile" && mobilePanel !== "none" && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobilePanel("none")}
          />
          <aside
            className="absolute top-0 bottom-0 bg-white shadow-2xl flex flex-col z-10 w-[min(18.5rem,90vw)]"
            style={
              mobilePanel === "props"
                ? { left: 0, borderRight: "1px solid #E5EAEF" }
                : { right: 0, borderLeft: "1px solid #E5EAEF" }
            }
          >
            <div className="h-12 shrink-0 flex items-center justify-between gap-2 px-3 border-b border-[#E5EAEF]">
              <span className="text-xs font-bold text-[#111]">
                {mobilePanel === "library"
                  ? "کتابخانه بلوک‌ها"
                  : mobilePanel === "layers"
                    ? "لایه‌ها"
                    : "ویژگی‌ها"}
              </span>
              <button
                type="button"
                className="h-9 w-9 rounded-lg hover:bg-[#F0F5F9] inline-flex items-center justify-center text-[#7C8FAC]"
                onClick={() => setMobilePanel("none")}
                aria-label="بستن"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              {mobilePanel === "library" && <BlockLibrary />}
              {mobilePanel === "layers" && <NavigatorPanel />}
              {mobilePanel === "props" && <PropertiesPanel />}
            </div>
          </aside>
        </div>
      )}

      {!isPreview && page && layoutMode === "mobile" && (
        <div className="shrink-0 h-14 border-t border-[#E5EAEF] bg-white flex items-center justify-around gap-1 px-2">
          <button
            type="button"
            onClick={() =>
              setMobilePanel((p) => (p === "library" ? "none" : "library"))
            }
            className={cn(
              "flex-1 h-11 rounded-xl inline-flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
              mobilePanel === "library"
                ? "bg-[#111] text-white"
                : "text-[#7C8FAC] hover:bg-[#F0F5F9]"
            )}
          >
            <Layers className="h-4 w-4" />
            <span>بلوک‌ها</span>
          </button>
          <button
            type="button"
            onClick={() =>
              setMobilePanel((p) => (p === "layers" ? "none" : "layers"))
            }
            className={cn(
              "flex-1 h-11 rounded-xl inline-flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
              mobilePanel === "layers"
                ? "bg-[#111] text-white"
                : "text-[#7C8FAC] hover:bg-[#F0F5F9]"
            )}
          >
            <ListTree className="h-4 w-4" />
            <span>لایه‌ها</span>
          </button>
          <button
            type="button"
            onClick={() =>
              setMobilePanel((p) => (p === "props" ? "none" : "props"))
            }
            className={cn(
              "flex-1 h-11 rounded-xl inline-flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
              mobilePanel === "props"
                ? "bg-[#111] text-white"
                : "text-[#7C8FAC] hover:bg-[#F0F5F9]"
            )}
          >
            <Settings2 className="h-4 w-4" />
            <span>ویژگی‌ها</span>
          </button>
        </div>
      )}
    </div>
  );
}
