"use client";

import { builderActions, getBuilderState } from "@/builder/store/builder-store";
import * as tree from "@/builder/store/tree";
import { confirmDialog } from "@/components/ui/ConfirmDialog";

function isTypingTarget(t: EventTarget | null): boolean {
  if (!t || typeof (t as Element).tagName !== "string") return false;
  const el = t as HTMLElement;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

/** Ask before deleting a block that contains other blocks */
export async function confirmAndRemove(id: string): Promise<void> {
  const s = getBuilderState();
  const loc = tree.findBlock(s.blocks, id);
  if (!loc) return;
  const kids = tree.getChildren(loc.block).length;
  const ok = await confirmDialog({
    title: "حذف بلوک؟",
    message: kids
      ? `این بلوک ${kids} بلوک داخلی دارد که همگی حذف می‌شوند. با «واگرد» قابل بازگشت است.`
      : "با «واگرد» (Ctrl+Z) قابل بازگشت است.",
    confirmLabel: "حذف",
    danger: true,
  });
  if (ok) builderActions.removeBlock(id);
}

/**
 * Global builder shortcuts. Attached to the main window and to the canvas
 * iframe document (key events do not cross the iframe boundary).
 */
export function handleBuilderKeyDown(e: KeyboardEvent, extra?: { onEscape?: () => void }) {
  const mod = e.metaKey || e.ctrlKey;
  const key = e.key.toLowerCase();
  const typing = isTypingTarget(e.target);
  const s = getBuilderState();
  const a = builderActions;

  if (mod && key === "s") {
    e.preventDefault();
    void a.saveDraft();
    return;
  }
  // Inside inputs keep native text editing (undo, copy, paste…)
  if (typing) return;

  if (mod && key === "z" && !e.shiftKey) {
    e.preventDefault();
    a.undo();
  } else if (mod && (key === "y" || (key === "z" && e.shiftKey))) {
    e.preventDefault();
    a.redo();
  } else if (mod && e.shiftKey && key === "c") {
    e.preventDefault();
    a.copyStyle();
  } else if (mod && e.shiftKey && key === "v") {
    e.preventDefault();
    a.pasteStyle();
  } else if (mod && key === "c") {
    if (!s.selectedBlockId) return;
    e.preventDefault();
    a.copyBlock();
  } else if (mod && key === "v") {
    if (!s.clipboard) return;
    e.preventDefault();
    a.pasteBlock();
  } else if (mod && key === "d") {
    e.preventDefault();
    if (s.selectedBlockId) a.duplicateBlock(s.selectedBlockId);
  } else if (e.key === "Escape") {
    a.clearSelection();
    extra?.onEscape?.();
  } else if ((e.key === "Delete" || e.key === "Backspace") && s.selectedBlockId) {
    e.preventDefault();
    void confirmAndRemove(s.selectedBlockId);
  } else if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown") && s.selectedBlockId) {
    e.preventDefault();
    a.moveBlockById(s.selectedBlockId, e.key === "ArrowUp" ? "up" : "down");
  }
}
