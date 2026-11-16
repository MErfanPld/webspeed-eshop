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
import { handleBuilderKeyDown } from "@/builder/hooks/shortcuts";
import { ConfirmHost } from "@/components/ui/ConfirmDialog";
import CommandPalette, { openCommandPalette } from "./CommandPalette";

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
  const selectedBlockId = useBuilderStore((s) => s.selectedBlockId);

  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("none");
  const [leftTab, setLeftTab] = useState<"blocks" | "layers">("blocks");
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layoutMode = useLayoutMode();
  const [frameDoc, setFrameDoc] = useState<Document | null>(null);

  const showSidebars = !isPreview && layoutMode !== "mobile";

  useEffect(() => {
    loadPage(pageId);
  }, [pageId, loadPage]);

  const blocks = useBuilderStore((s) => s.blocks);
  const saveStatus = useBuilderStore((s) => s.saveStatus);

  // Debounced autosave: restarts on every edit, skipped while a save runs
  // and after an error (until the next edit) to avoid retry loops.
  useEffect(() => {
    if (!isDirty || saveStatus === "saving" || saveStatus === "error") return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveDraft();
    }, 1000);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [isDirty, blocks, page, saveStatus, saveDraft]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (selectedBlockId && layoutMode === "mobile") {
      setMobilePanel("props");
    }
  }, [selectedBlockId, layoutMode]);

  // Keyboard shortcuts: main window + canvas iframe document
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCommandPalette();
        return;
      }
      handleBuilderKeyDown(e, { onEscape: () => setMobilePanel("none") });
    };
    window.addEventListener("keydown", onKey);
    frameDoc?.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      frameDoc?.removeEventListener("keydown", onKey);
    };
  }, [frameDoc]);

  const gridColumns = isPreview
    ? "minmax(0, 1fr)"
    : layoutMode === "mobile"
      ? "minmax(0, 1fr)"
      : layoutMode === "tablet"
        ? "minmax(200px, 220px) minmax(0, 1fr) minmax(250px, 270px)"
        : "minmax(250px, 270px) minmax(0, 1fr) minmax(290px, 320px)";

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
            <BuilderCanvas onFrameDocument={setFrameDoc} />
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
            className="absolute top-0 bottom-0 bg-white shadow-2xl flex flex-col z-10 w-[min(24rem,92vw)]"
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
      <CommandPalette />
      <ConfirmHost />
    </div>
  );
}
