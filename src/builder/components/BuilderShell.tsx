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

  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("none");
  const [leftTab, setLeftTab] = useState<"blocks" | "layers">("blocks");
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (selectedBlockId && typeof window !== "undefined" && window.innerWidth < 768) {
      setMobilePanel("props");
    }
  }, [selectedBlockId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveDraft();
      }
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (
        mod &&
        (e.key.toLowerCase() === "y" ||
          (e.key.toLowerCase() === "z" && e.shiftKey))
      ) {
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
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLSelectElement)
      ) {
        e.preventDefault();
        removeBlock(selectedBlockId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saveDraft, undo, redo, clearSelection, selectedBlockId, removeBlock]);

  return (
    <div
      className="flex flex-col h-[100dvh] overflow-hidden"
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
        <div className="flex flex-1 min-h-0 relative">
          {!isPreview && (
            <aside
              className={cn(
                "hidden md:flex flex-col shrink-0 bg-white border-border",
                "w-[240px] lg:w-[260px] border-l"
              )}
              style={{ borderColor: "#E5EAEF" }}
            >
              <div className="flex border-b shrink-0" style={{ borderColor: "#E5EAEF" }}>
                <button
                  type="button"
                  onClick={() => setLeftTab("blocks")}
                  className={cn(
                    "flex-1 h-11 text-xs font-semibold transition-colors",
                    leftTab === "blocks"
                      ? "border-b-2 border-[#5D87FF] text-[#2A3547]"
                      : "text-[#7C8FAC] hover:text-[#2A3547]"
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
                      ? "border-b-2 border-[#5D87FF] text-[#2A3547]"
                      : "text-[#7C8FAC] hover:text-[#2A3547]"
                  )}
                >
                  لایه‌ها
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                {leftTab === "blocks" ? <BlockLibrary /> : <NavigatorPanel />}
              </div>
            </aside>
          )}

          <div className="flex-1 min-w-0 min-h-0 flex flex-col">
            <BuilderCanvas />
          </div>

          {!isPreview && (
            <aside
              className={cn(
                "hidden md:flex flex-col shrink-0 bg-white",
                "w-[260px] lg:w-[300px] border-r"
              )}
              style={{ borderColor: "#E5EAEF" }}
            >
              <PropertiesPanel />
            </aside>
          )}

          {!isPreview && mobilePanel !== "none" && (
            <div className="md:hidden fixed inset-0 z-40">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobilePanel("none")}
              />
              <aside
                className={cn(
                  "absolute top-0 bottom-0 bg-white shadow-2xl flex flex-col z-10",
                  "w-[min(18.5rem,90vw)]"
                )}
                style={{
                  ...(mobilePanel === "library" || mobilePanel === "layers"
                    ? { right: 0, borderLeft: "1px solid #E5EAEF" }
                    : { left: 0, borderRight: "1px solid #E5EAEF" }),
                }}
              >
                <div
                  className="h-12 shrink-0 flex items-center justify-between gap-2 px-3 border-b"
                  style={{ borderColor: "#E5EAEF" }}
                >
                  <span className="text-xs font-bold text-[#2A3547]">
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
                <div className="flex-1 min-h-0 overflow-hidden">
                  {mobilePanel === "library" && <BlockLibrary />}
                  {mobilePanel === "layers" && <NavigatorPanel />}
                  {mobilePanel === "props" && <PropertiesPanel />}
                </div>
              </aside>
            </div>
          )}
        </div>
      )}

      {!isPreview && page && (
        <div
          className="md:hidden shrink-0 h-14 border-t bg-white flex items-center justify-around gap-1 px-2"
          style={{ borderColor: "#E5EAEF" }}
        >
          <button
            type="button"
            onClick={() =>
              setMobilePanel((p) => (p === "library" ? "none" : "library"))
            }
            className={cn(
              "flex-1 h-11 rounded-xl inline-flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
              mobilePanel === "library"
                ? "bg-[#5D87FF] text-white"
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
                ? "bg-[#5D87FF] text-white"
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
                ? "bg-[#5D87FF] text-white"
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
