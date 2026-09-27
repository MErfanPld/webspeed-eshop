"use client";

import { useEffect, useRef } from "react";
import { useBuilderStore } from "@/builder/store/builder-store";
import BuilderToolbar from "./BuilderToolbar";
import BlockLibrary from "./BlockLibrary";
import BuilderCanvas from "./BuilderCanvas";
import PropertiesPanel from "./PropertiesPanel";

type Props = { pageId: string };

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
      if (e.key === "Escape") clearSelection();
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
    <>
      <div className="lg:hidden min-h-screen flex items-center justify-center p-8 text-center bg-[#f5f5f5]">
        <div className="max-w-sm space-y-2">
          <p className="text-base font-bold">صفحه‌ساز WebSpeed</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            برای استفاده از صفحه‌ساز، لطفاً از دسکتاپ یا صفحه‌نمایش بزرگ‌تر
            استفاده کنید.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col h-screen overflow-hidden bg-[#f5f5f5]">
        <BuilderToolbar />
        {!hydrated ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            در حال بارگذاری...
          </div>
        ) : !page ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            صفحه یافت نشد
          </div>
        ) : (
          <div className="flex flex-1 min-h-0">
            {!isPreview && (
              <aside className="w-64 shrink-0 border-l border-border bg-white flex flex-col">
                <BlockLibrary />
              </aside>
            )}
            <BuilderCanvas />
            {!isPreview && (
              <aside className="w-72 shrink-0 border-r border-border bg-white flex flex-col">
                <PropertiesPanel />
              </aside>
            )}
          </div>
        )}
      </div>
    </>
  );
}
