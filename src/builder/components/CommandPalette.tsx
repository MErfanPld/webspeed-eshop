"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CornerDownLeft,
  Eye,
  LayoutGrid,
  Monitor,
  MousePointer2,
  Redo2,
  Save,
  Search,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import { blockRegistry, getBlockDefinition } from "@/builder/registry/block-registry";
import { builderActions, getBuilderState, useBuilderStore } from "@/builder/store/builder-store";
import * as tree from "@/builder/store/tree";
import { cn } from "@/lib/utils";
import { ICONS } from "./BlockLibrary";

const EVENT = "ws:command-palette";

type Target = { parentId: string | null; index: number };

/** Open the palette pre-filtered to "add block"; `target` = exact insert position (canvas "+" buttons) */
export function openQuickAdd(target?: Target) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { mode: "add", target } }));
}

/** Open the full palette (Ctrl/⌘+K) */
export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { mode: "all" } }));
}

type Item = {
  id: string;
  section: "افزودن بلوک" | "رفتن به بلوک" | "دستورها";
  label: string;
  hint?: string;
  keywords: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
};

/**
 * Command palette: type to add a block (after the selected one), jump to a
 * block on the page, or run an action. Fully keyboard driven.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "all">("all");
  const [target, setTarget] = useState<Target | undefined>();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const blocks = useBuilderStore((s) => s.blocks);
  const selectedId = useBuilderStore((s) => s.selectedBlockId);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ mode: "add" | "all"; target?: Target }>).detail;
      setMode(detail?.mode ?? "all");
      setTarget(detail?.target);
      setQ("");
      setActive(0);
      setOpen(true);
    };
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const add: Item[] = blockRegistry.map((b) => ({
      id: `add:${b.type}`,
      section: "افزودن بلوک",
      label: b.nameFa,
      hint: b.description,
      keywords: `${b.nameFa} ${b.name} ${b.type} ${b.description}`.toLowerCase(),
      icon: ICONS[b.icon] || LayoutGrid,
      run: () => builderActions.addBlock(b.type, target),
    }));
    if (mode === "add") return add;
    const goto: Item[] = tree.flatten(blocks).map(({ block, depth }) => {
      const def = getBlockDefinition(block.type);
      const label = String((block as { data?: Record<string, unknown> }).data?._label || def?.nameFa || block.type);
      return {
        id: `go:${block.id}`,
        section: "رفتن به بلوک",
        label: `${"— ".repeat(depth)}${label}`,
        keywords: `${label} ${block.type}`.toLowerCase(),
        icon: MousePointer2,
        run: () => builderActions.selectBlock(block.id),
      };
    });
    const a = builderActions;
    const commands: Item[] = [
      { id: "save", label: "ذخیره پیش‌نویس", hint: "Ctrl+S", icon: Save, run: () => void a.saveDraft() },
      { id: "undo", label: "واگرد", hint: "Ctrl+Z", icon: Undo2, run: () => a.undo() },
      { id: "redo", label: "انجام دوباره", hint: "Ctrl+Shift+Z", icon: Redo2, run: () => a.redo() },
      { id: "preview", label: "پیش‌نمایش / ویرایش", icon: Eye, run: () => a.setIsPreview(!getBuilderState().isPreview) },
      { id: "desktop", label: "نمای دسکتاپ", icon: Monitor, run: () => a.setPreviewDevice("desktop") },
      { id: "tablet", label: "نمای تبلت", icon: Tablet, run: () => a.setPreviewDevice("tablet") },
      { id: "mobile", label: "نمای موبایل", icon: Smartphone, run: () => a.setPreviewDevice("mobile") },
    ].map((c) => ({ ...c, section: "دستورها" as const, keywords: c.label.toLowerCase() }));
    return [...commands, ...add, ...goto];
  }, [mode, blocks, target]);

  const filtered = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return items.slice(0, 60);
    // Rank: name starts with the query > name contains it > only the description matches
    const score = (i: Item) => {
      const label = i.label.replace(/^(— )+/, "").toLowerCase();
      if (label.startsWith(terms[0])) return 0;
      if (terms.every((t) => label.includes(t))) return 1;
      return 2;
    };
    return items
      .filter((i) => terms.every((t) => i.keywords.includes(t)))
      .map((i, n) => ({ i, n, sc: score(i) }))
      .sort((x, y) => x.sc - y.sc || x.n - y.n)
      .slice(0, 60)
      .map((x) => x.i);
  }, [items, q]);

  useEffect(() => setActive(0), [q, mode]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const run = (item: Item | undefined) => {
    if (!item) return;
    setOpen(false);
    item.run();
  };

  const selectedName = (() => {
    if (!selectedId) return null;
    const b = tree.findBlock(blocks, selectedId)?.block;
    return b ? getBlockDefinition(b.type)?.nameFa ?? b.type : null;
  })();

  let lastSection = "";
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-3" dir="rtl">
      <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "add" ? "افزودن بلوک" : "جستجوی دستور"}
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#E5EAEF] overflow-hidden ws-fade-in"
        onKeyDown={(e) => {
          e.stopPropagation(); // don't trigger builder shortcuts (Escape deselects, Delete removes)
          if (e.key === "Escape") setOpen(false);
          else if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, filtered.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            run(filtered[active]);
          }
        }}
      >
        <div className="flex items-center gap-2 px-4 h-12 border-b border-[#E5EAEF]">
          <Search className="h-4 w-4 text-[#7C8FAC] shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={mode === "add" ? "نام بلوک را بنویسید..." : "بلوک، دستور یا بخشی از صفحه را جستجو کنید..."}
            aria-label="جستجو"
            role="combobox"
            aria-expanded="true"
            aria-controls="ws-palette-list"
            aria-activedescendant={filtered[active] ? `ws-cmd-${active}` : undefined}
            className="flex-1 h-full bg-transparent text-sm outline-none"
          />
          <kbd className="text-[10px] text-[#7C8FAC] border border-[#E5EAEF] rounded px-1.5 py-0.5">Esc</kbd>
        </div>
        {mode === "add" && (
          <p className="px-4 py-2 text-[11px] text-[#7C8FAC] bg-[#F7F9FB] border-b border-[#E5EAEF]">
            {target || !selectedName ? (target ? "در همان نقطه‌ای که «+» را زدید اضافه می‌شود" : "به انتهای صفحه اضافه می‌شود") : `بعد از «${selectedName}» اضافه می‌شود`}
          </p>
        )}
        <ul id="ws-palette-list" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-1.5">
          {filtered.map((item, i) => {
            const header = item.section !== lastSection && mode === "all";
            lastSection = item.section;
            return (
              <li key={item.id} role="presentation">
                {header && <p className="px-2.5 pt-2 pb-1 text-[10px] font-bold text-[#7C8FAC]">{item.section}</p>}
                <button
                  type="button"
                  id={`ws-cmd-${i}`}
                  role="option"
                  aria-selected={i === active}
                  data-index={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(item)}
                  className={cn(
                    "w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-right",
                    i === active ? "bg-[#111] text-white" : "text-[#2A3547]"
                  )}
                >
                  <span className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", i === active ? "bg-white/15" : "bg-[#F0F3F6]")}>
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] font-semibold truncate">{item.label}</span>
                    {item.hint && <span className={cn("block text-[11px] truncate", i === active ? "text-white/70" : "text-[#7C8FAC]")}>{item.hint}</span>}
                  </span>
                  {i === active && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 opacity-70" />}
                </button>
              </li>
            );
          })}
          {!filtered.length && <li className="py-10 text-center text-xs text-[#7C8FAC]">نتیجه‌ای یافت نشد</li>}
        </ul>
        <div className="flex items-center gap-3 px-4 h-9 border-t border-[#E5EAEF] text-[10px] text-[#7C8FAC]">
          <span>↑↓ حرکت</span>
          <span>Enter انتخاب</span>
          <span className="flex-1" />
          <span>Ctrl+K همه دستورها</span>
        </div>
      </div>
    </div>
  );
}
