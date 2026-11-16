"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkPlus, ChevronDown, LayoutTemplate, Trash2 } from "lucide-react";
import { useBuilderStore } from "@/builder/store/builder-store";
import * as tree from "@/builder/store/tree";
import type { PageBlock } from "@/builder/types";
import { api, errorMessage } from "@/lib/api/client";
import type { SavedBlockItem } from "@/types/api";
import { confirmDialog } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

/**
 * Reusable blocks and page templates stored per store in the API.
 * - "ذخیره بلوک": saves the selected block (with its children)
 * - "ذخیره قالب": saves the whole page; applying a template replaces the page
 */
export default function SavedBlocksSection() {
  const blocks = useBuilderStore((s) => s.blocks);
  const selectedId = useBuilderStore((s) => s.selectedBlockId);
  const insertBlocks = useBuilderStore((s) => s.insertBlocks);
  const setBlocks = useBuilderStore((s) => s.setBlocks);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SavedBlockItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || items) return;
    api<{ items: SavedBlockItem[] }>("/admin/saved-blocks")
      .then((r) => setItems(r.items))
      .catch((e) => setError(errorMessage(e, "بارگذاری ناموفق بود")));
  }, [open, items]);

  const save = async (kind: "block" | "template") => {
    const selected = selectedId ? tree.findBlock(blocks, selectedId)?.block : null;
    const payload = kind === "block" ? (selected ? [selected] : []) : blocks;
    if (!payload.length) {
      setError(kind === "block" ? "ابتدا یک بلوک را در بوم انتخاب کنید" : "صفحه خالی است");
      return;
    }
    const name = window.prompt(kind === "block" ? "نام بلوک ذخیره‌شده:" : "نام قالب صفحه:")?.trim();
    if (!name) return;
    setBusy(true);
    setError(null);
    try {
      const { item } = await api<{ item: SavedBlockItem }>("/admin/saved-blocks", {
        method: "POST",
        body: { kind, name, blocks: payload },
      });
      setItems((list) => [item, ...(list ?? [])]);
      setOpen(true);
    } catch (e) {
      setError(errorMessage(e, "ذخیره ناموفق بود"));
    } finally {
      setBusy(false);
    }
  };

  const apply = async (item: SavedBlockItem) => {
    const incoming = item.blocks as PageBlock[];
    if (item.kind === "template") {
      const ok = await confirmDialog({
        title: `اعمال قالب «${item.name}»؟`,
        message: "بلوک‌های فعلی صفحه جایگزین می‌شوند (با «واگرد» برمی‌گردد).",
        confirmLabel: "اعمال قالب",
      });
      if (!ok) return;
      setBlocks([]);
      insertBlocks(incoming, { parentId: null, index: 0 });
    } else {
      insertBlocks(incoming);
    }
  };

  const remove = async (item: SavedBlockItem) => {
    if (!(await confirmDialog({ title: `حذف «${item.name}»؟`, confirmLabel: "حذف", danger: true }))) return;
    try {
      await api(`/admin/saved-blocks/${item.id}`, { method: "DELETE" });
      setItems((list) => (list ?? []).filter((i) => i.id !== item.id));
    } catch (e) {
      setError(errorMessage(e, "حذف ناموفق بود"));
    }
  };

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-3 h-10 text-xs font-bold text-muted-foreground hover:text-foreground"
      >
        <span className="inline-flex items-center gap-1.5">
          <Bookmark className="h-3.5 w-3.5" /> ذخیره‌شده‌ها و قالب‌ها
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-2 pb-3 space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            <button type="button" disabled={busy} onClick={() => save("block")} className="h-8 rounded-lg bg-muted text-[11px] font-medium inline-flex items-center justify-center gap-1 hover:bg-white border border-transparent hover:border-border">
              <BookmarkPlus className="h-3.5 w-3.5" /> ذخیره بلوک
            </button>
            <button type="button" disabled={busy} onClick={() => save("template")} className="h-8 rounded-lg bg-muted text-[11px] font-medium inline-flex items-center justify-center gap-1 hover:bg-white border border-transparent hover:border-border">
              <LayoutTemplate className="h-3.5 w-3.5" /> ذخیره قالب
            </button>
          </div>
          {error && <p role="alert" className="text-[11px] text-red-600">{error}</p>}
          {items === null ? (
            <p className="text-[11px] text-muted-foreground text-center py-2">در حال بارگذاری...</p>
          ) : !items.length ? (
            <p className="text-[11px] text-muted-foreground text-center py-2">هنوز چیزی ذخیره نکرده‌اید.</p>
          ) : (
            <ul className="space-y-1 max-h-56 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => apply(item)}
                    title={item.kind === "template" ? "اعمال قالب روی صفحه" : "افزودن به صفحه"}
                    className="flex-1 min-w-0 text-right px-2 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-border"
                  >
                    <span className="block text-xs font-semibold truncate">{item.name}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {item.kind === "template" ? "قالب صفحه" : "بلوک"} · {item.blocks.length} بلوک
                    </span>
                  </button>
                  <button type="button" aria-label={`حذف ${item.name}`} onClick={() => remove(item)} className="h-7 w-7 rounded-md text-red-600 hover:bg-red-50 inline-flex items-center justify-center shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
