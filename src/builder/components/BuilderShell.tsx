"use client";

import { useEffect, useRef, useState } from "react";
import { useBuilderStore } from "@/builder/store/builder-store";
import BuilderToolbar from "./BuilderToolbar";
import BlockLibrary from "./BlockLibrary";
import BuilderCanvas from "./BuilderCanvas";
import PropertiesPanel from "./PropertiesPanel";
import { Layers, Settings2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { pageId: string };
type MobilePanel = "none" | "library" | "props";

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
    if (selectedBlockId && typeof window !== "undefined" && window.innerWidth < 1024) {
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
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-[#f5f5f5]">
      <BuilderToolbar
        onOpenLibrary={() =>
          setMobilePanel((p) => (p === "library" ? "none" : "library"))
        }
        onOpenProps={() =>
          setMobilePanel((p) => (p === "props" ? "none" : "props"))
        }
      />

      {!hydrated ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground px-4">
          در حال بارگذاری...
        </div>
      ) : !page ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground px-4 text-center">
          صفحه یافت نشد. از لیست صفحات یک صفحه بسازید یا انتخاب کنید.
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 relative">
          {!isPreview && (
            <aside className="hidden lg:flex w-60 xl:w-64 shrink-0 border-l border-border bg-white flex-col">
              <BlockLibrary />
            </aside>
          )}

          <BuilderCanvas />

          {!isPreview && (
            <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r border-border bg-white flex-col">
              <PropertiesPanel />
            </aside>
          )}

          {!isPreview && mobilePanel !== "none" && (
            <div className="lg:hidden fixed inset-0 z-40 flex">
              <div
                className="absolute inset-0 bg-foreground/25"
                onClick={() => setMobilePanel("none")}
              />
              <aside
                className={cn(
                  "absolute top-0 bottom-0 bg-white shadow-xl flex flex-col w-[min(20rem,88vw)] z-10",
                  mobilePanel === "library"
                    ? "right-0 border-l border-border"
                    : "left-0 border-r border-border"
                )}
              >
                <div className="h-12 shrink-0 flex items-center justify-between gap-2 px-3 border-b border-border">
                  <span className="text-xs font-bold">
                    {mobilePanel === "library" ? "کتابخانه بلوک‌ها" : "ویژگی‌ها"}
                  </span>
                  <button
                    type="button"
                    className="h-9 w-9 rounded-lg hover:bg-muted inline-flex items-center justify-center"
                    onClick={() => setMobilePanel("none")}
                    aria-label="بستن"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  {mobilePanel === "library" ? <BlockLibrary /> : <PropertiesPanel />}
                </div>
              </aside>
            </div>
          )}
        </div>
      )}

      {!isPreview && page && (
        <div className="lg:hidden shrink-0 h-14 border-t border-border bg-white flex items-center justify-around gap-1 px-2">
          <button
            type="button"
            onClick={() =>
              setMobilePanel((p) => (p === "library" ? "none" : "library"))
            }
            className={cn(
              "flex-1 h-11 rounded-xl inline-flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
              mobilePanel === "library"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Layers className="h-4 w-4" />
            <span>بلوک‌ها</span>
          </button>
          <button
            type="button"
            onClick={() =>
              setMobilePanel((p) => (p === "props" ? "none" : "props"))
            }
            className={cn(
              "flex-1 h-11 rounded-xl inline-flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
              mobilePanel === "props"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted"
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
